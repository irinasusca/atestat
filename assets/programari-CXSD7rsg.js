import{r as p,u as f,A as l}from"./auth-DmvQw-zI.js";let d="current",c=[],o=null;document.addEventListener("DOMContentLoaded",async()=>{try{console.log("1. Starting DOMContentLoaded"),o=await p(),console.log("2. Current user set:",o),await f(),console.log("3. Navbar updated"),await m(),console.log("4. Programari loaded"),y(),console.log("5. Event listeners setup")}catch(t){console.error("ERROR in DOMContentLoaded:",t)}});function y(){const t=document.getElementById("toggle-current"),e=document.getElementById("toggle-past"),a=document.getElementById("add-appointment-btn");t?.addEventListener("click",()=>{d="current",u(),g()}),e?.addEventListener("click",()=>{d="past",u(),g()}),a?.addEventListener("click",()=>{o?.rol==="doctor"?window.location.href="./modifica-orar.html":window.location.href="./add-programare.html"})}function u(){const t=document.getElementById("toggle-current"),e=document.getElementById("toggle-past");d==="current"?(t?.classList.add("bg-gray-700","text-white"),t?.classList.remove("text-gray-700"),e?.classList.remove("bg-gray-700","text-white"),e?.classList.add("text-gray-700")):(e?.classList.add("bg-gray-700","text-white"),e?.classList.remove("text-gray-700"),t?.classList.remove("bg-gray-700","text-white"),t?.classList.add("text-gray-700"))}function h(){const t=document.getElementById("add-appointment-btn");t&&o&&(o.rol==="doctor"?t.textContent="Modifică Orar":t.textContent="Adaugă Programare")}async function m(){const t=document.getElementById("loading-state"),e=document.getElementById("appointments-container");try{console.log("Loading programari for user:",o),t?.classList.remove("hidden"),e?.classList.add("hidden");const a=o?.rol==="doctor"?`${l}/api/programari/doctor/${o.id_utilizator}`:`${l}/api/programari/pacient/${o.id_utilizator}`;console.log("Fetching from endpoint:",a);const r=await fetch(a,{method:"GET",credentials:"include",headers:{"Content-Type":"application/json"}});if(console.log("Response status:",r.status),!r.ok){if(r.status===401){window.location.href="./login.html";return}throw new Error("Failed to load programari")}c=await r.json(),console.log("Loaded programari:",JSON.stringify(c,null,2)),h(),g()}catch(a){console.error("Error loading programari:",a),alert("Eroare la încărcarea programărilor")}finally{t?.classList.add("hidden"),e?.classList.remove("hidden")}}function g(){const t=document.getElementById("appointments-container"),e=document.getElementById("empty-state");if(!t||!e)return;const a=new Date,r=c.filter(n=>{const i=new Date(n.data_programare);return d==="current"?i>=a:i<a});if(r.length===0){t.innerHTML="",e.classList.remove("hidden");return}e.classList.add("hidden"),t.innerHTML=r.map(n=>o?.rol==="doctor"?v(n):x(n)).join(""),o?.rol==="pacient"&&t.querySelectorAll(".cancel-btn").forEach(n=>{n.addEventListener("click",i=>{const s=i.target.dataset.id;s&&b(parseInt(s))})})}function x(t){const e=new Date(t.data_programare),a=e.toLocaleDateString("ro-RO",{day:"2-digit",month:"short",year:"numeric"}),r=e.toLocaleTimeString("ro-RO",{hour:"2-digit",minute:"2-digit"}),i=e<new Date?"":`
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
    `}async function b(t){if(confirm("Sigur doriți să anulați această programare?"))try{if(!(await fetch(`${l}/api/programari/${t}`,{method:"DELETE",credentials:"include",headers:{"Content-Type":"application/json"}})).ok)throw new Error("Failed to cancel programare");await m(),alert("Programarea a fost anulată cu succes")}catch(e){console.error("Error canceling programare:",e),alert("Eroare la anularea programării")}}
