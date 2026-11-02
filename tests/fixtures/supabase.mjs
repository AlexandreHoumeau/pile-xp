import http from 'node:http';
let projects = ['Alpha','Bravo','Charlie'].map((title,i)=>({id:String(i+1),title,slug:title.toLowerCase(),created_at:'2020-01-01',display_order:i,photos:['fixture.png'],blueprints:[],program:i===1?['office']:['housing'],description:'Première ligne\nDeuxième ligne\n\nAutre paragraphe',address:'Paris',budget:'',delivery:'',project_owner:'',project_management:'',status:'',surface:'',pdf_url:null,youtube_url:''}));
let sections=[{id:'section1',about_id:'about1',title:'Notre agence',description:'Ligne une\nLigne deux\n\nParagraphe suivant',position:0}];
let about={id:'about1',photos:[],footer_text:'PILE.XP'};
let failNext=false;
http.createServer(async(req,res)=>{
 res.setHeader('Access-Control-Allow-Origin','*'); res.setHeader('Access-Control-Allow-Headers','*'); res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE,OPTIONS');
 if(req.method==='OPTIONS'){res.end();return;}
 if(req.url.includes('/storage/v1/object/public/projects/fixture.png')){res.setHeader('Content-Type','image/png');res.end(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aCWQAAAAASUVORK5CYII=','base64'));return;}
 let chunks=[]; for await(const c of req)chunks.push(c);
 const raw=Buffer.concat(chunks).toString(); const body=raw?JSON.parse(raw):null;
 const url=new URL(req.url,'http://localhost'); let data=[];
 if(url.pathname==='/test/fail-next'){failNext=true;res.end('{}');return;}
 if(url.pathname==='/test/state'){data={projects,sections};}
 else if(url.pathname.endsWith('/rpc/reorder_projects')){
   if(req.headers.authorization!=='Bearer local-test-service-role'){res.statusCode=403;data={message:'Forbidden'};}
   else if(failNext){failNext=false;res.statusCode=409;data={code:'40001',message:'stale'};}
   else {const ordered=[...projects].sort((a,b)=>a.display_order-b.display_order).map(p=>p.id);if(JSON.stringify(ordered)!==JSON.stringify(body.expected_ids)){res.statusCode=409;data={code:'40001'};}else{body.ordered_ids.forEach((id,i)=>projects.find(p=>p.id===id).display_order=i); data=null;}}
 }
 else if(url.pathname.endsWith('/projects')){
   let rows=projects.filter(p=>(!url.searchParams.has('id')||p.id===url.searchParams.get('id').slice(3))&&(!url.searchParams.has('slug')||p.slug===url.searchParams.get('slug').slice(3)));
   if(req.method==='PATCH'){rows.forEach(p=>Object.assign(p,body));}
   if(url.searchParams.get('program')?.startsWith('cs.'))rows=rows.filter(p=>p.program.some(t=>url.searchParams.get('program').includes(t)));
   data=rows.sort((a,b)=>a.display_order-b.display_order);
 }
 else if(url.pathname.endsWith('/about_info')){if(req.method==='PATCH')Object.assign(about,body);data=[about];}
 else if(url.pathname.endsWith('/about_sections')){
   if(req.method==='DELETE')sections=[];
   if(req.method==='POST')sections=body.map((s,i)=>({...s,id:'section'+i,position:i}));
   data=sections;
 }
 else if(url.pathname.endsWith('/tags'))data=[{name:'housing'},{name:'office'}];
 if(req.headers.accept?.includes('application/vnd.pgrst.object'))data=Array.isArray(data)?data[0]??null:data;
 res.setHeader('Content-Type','application/json');res.end(JSON.stringify(data));
}).listen(54321,'127.0.0.1',()=>console.log('Local fixture API ready'));
