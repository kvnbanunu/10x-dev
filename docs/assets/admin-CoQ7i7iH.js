import{i as c,d as E,s as i,j as h}from"./auth-5AvIqP9D.js";const g=document.getElementById("users-table"),f=document.getElementById("requests-table"),r=document.getElementById("edit-modal"),p=document.getElementById("edit-user-form"),y=document.querySelector(".close");let o=null;const w=async()=>{try{const e=await h();e&&(o=e.user,l())}catch(e){console.error("Admin initialization error:",e)}},l=async()=>{try{const e=await c.getDatabaseEntries(),{users:d,requests:n}=e.data;x(d),I(n)}catch{i("Failed to load database data")}},x=e=>{const d=g.querySelector("tbody");if(d.innerHTML="",e.length===0){const t=document.createElement("tr");t.innerHTML='<td colspan="5">No users found</td>',d.appendChild(t);return}e.forEach(t=>{const s=document.createElement("tr");s.innerHTML=`
      <td class="px-4 py-2">${t.id}</td>
      <td class="px-4 py-2">${t.email}</td>
      <td class="px-4 py-2">${t.username}</td>
      <td class="px-4 py-2">${t.is_admin===1?"Yes":"No"}</td>
      <td class="px-4 py-2 text-right space-x-2">
        <button class="px-2 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 edit-button" data-id="${t.id}" 
          ${t.id===o.id?"disabled":""}>Edit</button>
        <button class="px-2 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 delete-button" data-id="${t.id}"
          ${t.id===o.id?"disabled":""}>Delete</button>
      </td>
    `,d.appendChild(s)}),document.querySelectorAll(".edit-button").forEach(t=>{t.addEventListener("click",()=>{const s=parseInt(t.getAttribute("data-id"),10),m=e.find(b=>b.id===s);m&&B(m)})}),document.querySelectorAll(".delete-button").forEach(t=>{t.addEventListener("click",async()=>{const s=parseInt(t.getAttribute("data-id"),10);confirm("Are you sure you want to delete this user?")&&await v(s)})})},I=e=>{const d=f.querySelector("tbody");if(d.innerHTML="",e.length===0){const n=document.createElement("tr");n.innerHTML='<td colspan="4">No requests found</td>',d.appendChild(n);return}e.forEach(n=>{const a=document.createElement("tr"),t=new Date(n.timestamp*1e3).toLocaleString();a.innerHTML=`
      <td class="px-4 py-2">${n.id}</td>
      <td class="px-4 py-2">${n.user_id}</td>
      <td class="px-4 py-2">${n.prompt}</td>
      <td class="px-4 py-2">${t}</td>
    `,d.appendChild(a)})},B=e=>{document.getElementById("edit-user-id").value=e.id,document.getElementById("edit-email").value=e.email,document.getElementById("edit-username").value=e.username,document.getElementById("edit-admin").checked=e.is_admin===1,r.style.display="flex"},u=()=>{r.style.display="none"},v=async e=>{try{await c.deleteUser(e),E("User deleted successfully"),l()}catch{i("Failed to delete user")}},L=async(e,d)=>{try{await c.updateUser(e,d),E("User updated successfully"),l(),u()}catch{i("Failed to update user")}};y&&y.addEventListener("click",u);window.addEventListener("click",e=>{e.target===r&&u()});p&&p.addEventListener("submit",async e=>{e.preventDefault();const d=parseInt(document.getElementById("edit-user-id").value,10),n=document.getElementById("edit-email").value.trim(),a=document.getElementById("edit-username").value.trim(),t=document.getElementById("edit-admin").checked?1:0;await L(d,{email:n,username:a,isAdmin:t})});document.addEventListener("DOMContentLoaded",w);
