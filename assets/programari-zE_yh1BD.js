import{r as p,u as y,A as c}from"./auth-BI3OkvaQ.js";let d="current",u=[],n=null;document.addEventListener("DOMContentLoaded",async()=>{try{n=await p(),await y(),await m(),f()}catch(t){console.error("ERROR in DOMContentLoaded:",t)}});function f(){const t=document.getElementById("toggle-current"),e=document.getElementById("toggle-past"),a=document.getElementById("add-appointment-btn");t?.addEventListener("click",()=>{d="current",g(),l()}),e?.addEventListener("click",()=>{d="past",g(),l()}),a?.addEventListener("click",()=>{n?.rol==="doctor"?window.location.href="./modifica-orar.html":window.location.href="./add-programare.html"})}function g(){const t=document.getElementById("toggle-current"),e=document.getElementById("toggle-past");d==="current"?(t?.classList.add("bg-gray-700","text-white"),t?.classList.remove("text-gray-700"),e?.classList.remove("bg-gray-700","text-white"),e?.classList.add("text-gray-700")):(e?.classList.add("bg-gray-700","text-white"),e?.classList.remove("text-gray-700"),t?.classList.remove("bg-gray-700","text-white"),t?.classList.add("text-gray-700"))}function h(){const t=document.getElementById("add-appointment-btn");t&&n&&(n.rol==="doctor"?t.textContent="Modifică Orar":t.textContent="Adaugă Programare")}async function m(){const t=document.getElementById("loading-state"),e=document.getElementById("appointments-container");try{t?.classList.remove("hidden"),e?.classList.add("hidden");const a=n?.rol==="doctor"?`${c}/api/programari/doctor/${n.id_utilizator}`:`${c}/api/programari/pacient/${n.id_utilizator}`,r=await fetch(a,{method:"GET",credentials:"include",headers:{"Content-Type":"application/json"}});if(!r.ok){if(r.status===401){window.location.href="./login.html";return}throw new Error("Failed to load programari")}u=await r.json(),h(),l()}catch(a){console.error("Error loading programari:",a),alert("Eroare la încărcarea programărilor")}finally{t?.classList.add("hidden"),e?.classList.remove("hidden")}}function l(){const t=document.getElementById("appointments-container"),e=document.getElementById("empty-state");if(!t||!e)return;const a=new Date,r=u.filter(o=>{const i=new Date(o.data_programare);return d==="current"?i>=a:i<a});if(r.length===0){t.innerHTML="",e.classList.remove("hidden");return}e.classList.add("hidden"),t.innerHTML=r.map(o=>n?.rol==="doctor"?v(o):x(o)).join(""),n?.rol==="pacient"&&t.querySelectorAll(".cancel-btn").forEach(o=>{o.addEventListener("click",i=>{const s=i.target.dataset.id;s&&w(parseInt(s))})})}function x(t){const e=new Date(t.data_programare),a=e.toLocaleDateString("ro-RO",{day:"2-digit",month:"short",year:"numeric"}),r=e.toLocaleTimeString("ro-RO",{hour:"2-digit",minute:"2-digit"}),i=e<new Date?"":`
        <button data-id="${t.id_programare}" class="cancel-btn absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-semibold">
            Anulează →
        </button>
    `,s=`${t.doctor_prenume}_${t.doctor_nume}.jpg`.toLowerCase();return`
        <div class="bg-gray-50 rounded-2xl shadow-lg p-6 relative">
            ${i}
            
            <div class="flex items-center gap-4 mb-6">
                <img src="./doctors/${s}" 
                     alt="Dr. ${t.doctor_nume} ${t.doctor_prenume}" 
                     class="w-16 h-16 rounded-full object-cover flex-shrink-0"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="w-16 h-16 rounded-full bg-web-dark-blue flex-shrink-0" style="display: none;"></div>
                <div>
                    <h3 class="text-xl font-bold text-gray-900">Dr. ${t.doctor_nume||""} ${t.doctor_prenume||""}</h3>
                    <p class="text-gray-600">${t.doctor_specializare||"Medicină internă"}</p>
                </div>
            </div>
            
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-sm text-gray-700 mb-1">Data consultatiei</p>
                    <p class="font-bold text-gray-900">${a}</p>
                    <p class="font-bold text-gray-900">${r}</p>
                </div>
                <div class="text-right">
                    <p class="text-sm text-gray-700 mb-1">Locatia</p>
                    <p class="font-bold text-gray-900">${t.doctor_locatie||"Cluj Zorilor"}</p>
                    <p class="text-gray-900 text-sm">Clinicum Center</p>
                </div>
            </div>
        </div>
    `}function v(t){const e=new Date(t.data_programare),a=e.toLocaleDateString("ro-RO",{day:"2-digit",month:"short",year:"numeric"}),r=e.toLocaleTimeString("ro-RO",{hour:"2-digit",minute:"2-digit"});return`
        <div class="bg-gray-50 rounded-2xl shadow-lg p-6 relative">
            
            <div class="flex items-center gap-4 mb-6">
                <div class="w-16 h-16 rounded-full bg-web-dark-blue flex-shrink-0"></div>
                <div>
                    <h3 class="text-xl font-bold text-gray-900">${t.pacient_nume||""} ${t.pacient_prenume||""}</h3>
                    <p class="text-gray-600">Pacient</p>
                </div>
            </div>
            
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-sm text-gray-700 mb-1">Data consultatiei</p>
                    <p class="font-bold text-gray-900">${a}</p>
                    <p class="font-bold text-gray-900">${r}</p>
                </div>
            </div>
        </div>
    `}async function w(t){if(confirm("Sigur doriți să anulați această programare?"))try{if(!(await fetch(`${c}/api/programari/${t}`,{method:"DELETE",credentials:"include",headers:{"Content-Type":"application/json"}})).ok)throw new Error("Failed to cancel programare");await m(),alert("Programarea a fost anulată cu succes")}catch(e){console.error("Error canceling programare:",e),alert("Eroare la anularea programării")}}
