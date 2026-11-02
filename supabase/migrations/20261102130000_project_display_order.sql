BEGIN;

-- Preserve the current newest-first feed, breaking equal dates by primary key.
ALTER TABLE public.projects ADD COLUMN display_order bigint;
WITH ranked AS (
  SELECT id, row_number() OVER (ORDER BY created_at DESC, id ASC) - 1 AS position
  FROM public.projects
)
UPDATE public.projects AS p SET display_order = ranked.position
FROM ranked WHERE p.id = ranked.id;

-- Monotonic allocation appends new projects, including concurrent inserts.
-- Reorders compact positions but never rewind this sequence; deletions need no renumbering.
CREATE SEQUENCE public.projects_display_order_seq MINVALUE 0 START WITH 0;
ALTER SEQUENCE public.projects_display_order_seq OWNED BY public.projects.display_order;
SELECT setval('public.projects_display_order_seq',
  COALESCE((SELECT max(display_order) + 1 FROM public.projects), 0), false);
ALTER TABLE public.projects
  ALTER COLUMN display_order SET DEFAULT nextval('public.projects_display_order_seq'),
  ALTER COLUMN display_order SET NOT NULL,
  ADD CONSTRAINT projects_display_order_nonnegative CHECK (display_order >= 0),
  ADD CONSTRAINT projects_display_order_unique UNIQUE (display_order) DEFERRABLE INITIALLY DEFERRED;
GRANT USAGE, SELECT ON SEQUENCE public.projects_display_order_seq TO service_role;

-- Existing broad UPDATE policies must not grant direct ordering writes to the browser.
CREATE FUNCTION public.protect_project_display_order() RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
  IF NEW.display_order IS DISTINCT FROM OLD.display_order
     AND current_user NOT IN ('service_role', 'postgres', 'supabase_admin') THEN
    RAISE EXCEPTION 'Project ordering requires the authenticated server action' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER protect_project_display_order BEFORE UPDATE OF display_order
ON public.projects FOR EACH ROW EXECUTE FUNCTION public.protect_project_display_order();

-- Called only by the server, after checking the signed application session.
-- Text IDs support the existing primary key without assuming UUID vs bigint.
CREATE FUNCTION public.reorder_projects(ordered_ids text[], expected_ids text[]) RETURNS void
LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE current_ids text[];
BEGIN
  LOCK TABLE public.projects IN SHARE ROW EXCLUSIVE MODE;
  SELECT COALESCE(array_agg(id::text ORDER BY display_order, id), ARRAY[]::text[])
    INTO current_ids FROM public.projects;
  IF expected_ids IS DISTINCT FROM current_ids THEN
    RAISE EXCEPTION 'Projects changed; reload before reordering' USING ERRCODE = '40001';
  END IF;
  IF ordered_ids IS NULL OR cardinality(ordered_ids) <> cardinality(current_ids)
     OR EXISTS (SELECT 1 FROM unnest(ordered_ids) AS ids(id) WHERE id IS NULL)
     OR (SELECT count(DISTINCT id) FROM unnest(ordered_ids) AS ids(id)) <> cardinality(current_ids)
     OR NOT (ordered_ids @> current_ids AND ordered_ids <@ current_ids) THEN
    RAISE EXCEPTION 'Expected each project exactly once' USING ERRCODE = '22023';
  END IF;
  UPDATE public.projects AS p SET display_order = ordered.position - 1
    FROM unnest(ordered_ids) WITH ORDINALITY AS ordered(id, position)
    WHERE p.id::text = ordered.id;
END;
$$;
REVOKE ALL ON FUNCTION public.reorder_projects(text[], text[]) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reorder_projects(text[], text[]) TO service_role;

COMMIT;
