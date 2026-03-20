import{r as S,u as E,A as h}from"./auth-DKx7HzCU.js";let m=[],p=[],n=new Date,u=[],l=null;const b=["ianuarie","februarie","martie","aprilie","mai","iunie","iulie","august","septembrie","octombrie","noiembrie","decembrie"],L=["Duminică","Luni","Marți","Miercuri","Joi","Vineri","Sâmbătă"];document.addEventListener("DOMContentLoaded",async()=>{await S(),await E();const t=sessionStorage.getItem("selectedSpecialitati"),e=sessionStorage.getItem("selectedLocatii");t&&(m=JSON.parse(t)),e&&(p=JSON.parse(e)),f(),D(),await $()});function D(){document.getElementById("date-picker-btn")?.addEventListener("click",x),document.getElementById("close-date-picker")?.addEventListener("click",y),document.getElementById("date-input")?.addEventListener("change",w),document.getElementById("confirm-booking-btn")?.addEventListener("click",k),document.getElementById("close-popup-btn")?.addEventListener("click",C),document.getElementById("date-picker-popup")?.addEventListener("click",t=>{t.target.id==="date-picker-popup"&&y()})}function x(){const t=document.getElementById("date-picker-popup"),e=document.getElementById("date-input"),a=new Date,o=a.getFullYear(),r=String(a.getMonth()+1).padStart(2,"0"),i=String(a.getDate()).padStart(2,"0");e.min=`${o}-${r}-${i}`;const c=n.getFullYear(),d=String(n.getMonth()+1).padStart(2,"0"),s=String(n.getDate()).padStart(2,"0");e.value=`${c}-${d}-${s}`,t?.classList.remove("hidden")}function y(){document.getElementById("date-picker-popup")?.classList.add("hidden")}function w(t){const e=t.target;n=new Date(e.value+"T00:00:00"),f(),y(),$()}function f(){const t=L[n.getDay()],e=n.getDate(),a=b[n.getMonth()],o=document.getElementById("selected-date-text");o&&(o.textContent=`${t}, ${e} ${a}`)}async function $(){const t=document.getElementById("loading-state"),e=document.getElementById("empty-state"),a=document.getElementById("slots-container");try{t?.classList.remove("hidden"),a?.classList.add("hidden"),e?.classList.add("hidden");const o=n.getDay(),r=n.getFullYear(),i=String(n.getMonth()+1).padStart(2,"0"),c=String(n.getDate()).padStart(2,"0"),d=`${r}-${i}-${c}`;console.log("Fetching available slots with:",{locatii:p.length>0?p:null,specializari:m.length>0?m:null,zi_saptamana:o,data_programare:d,selectedDate:n.toString()});const s=await fetch(`${h}/api/programari/available`,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({locatii:p.length>0?p:null,specializari:m.length>0?m:null,zi_saptamana:o,data_programare:d})});if(console.log("Response status:",s.status),!s.ok){const g=await s.json();throw console.error("Error response:",g),new Error(g.message||"Failed to load available slots")}u=await s.json(),console.log("Available doctors:",u),u.length===0?e?.classList.remove("hidden"):(I(),a?.classList.remove("hidden"))}catch(o){console.error("Error loading available slots:",o),alert("Eroare la încărcarea intervalelor disponibile: "+o.message),e?.classList.remove("hidden")}finally{t?.classList.add("hidden")}}function I(){const t=document.getElementById("slots-container");t&&(t.innerHTML=u.map(e=>_(e)).join(""),document.querySelectorAll(".time-slot-btn").forEach(e=>{e.addEventListener("click",a=>{const o=a.target,r=o.dataset.doctorId,i=o.dataset.slot,c=o.dataset.doctorName,d=o.dataset.doctorPrenume,s=o.dataset.doctorNume,g=o.dataset.doctorSpec,v=o.dataset.doctorLocation;B({doctorId:r,slot:i,doctorName:c,doctorPrenume:d,doctorNume:s,doctorSpec:g,doctorLocation:v})})}))}function _(t){return`
        <div class="bg-gray-50 rounded-2xl p-6">
            <div class="flex items-center gap-4 mb-6">
                <img src="./doctors/${`${t.doctor_prenume}_${t.doctor_nume}.jpg`.toLowerCase()}" 
                     alt="Dr. ${t.doctor_nume} ${t.doctor_prenume}" 
                     class="w-16 h-16 rounded-full object-cover flex-shrink-0"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="w-16 h-16 rounded-full bg-red-300 flex-shrink-0" style="display: none;"></div>
                <div>
                    <h3 class="text-xl font-bold text-gray-900">Dr. ${t.doctor_nume} ${t.doctor_prenume}</h3>
                    <p class="text-gray-600">${t.doctor_specializare}</p>
                </div>
            </div>
            
            <div class="mb-4">
                <p class="text-sm font-medium text-gray-700 mb-1">Locatia</p>
                <p class="font-bold text-gray-900">${t.doctor_locatie}</p>
                <p class="text-sm text-gray-700">Clinicum Center</p>
            </div>
            
            <div>
                <p class="text-sm font-medium text-gray-700 mb-3">Intervale disponibile</p>
                <div class="flex flex-wrap gap-2">
                    ${t.slots.map(a=>`
                        <button class="time-slot-btn bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                                data-doctor-id="${t.doctor_id}"
                                data-slot="${a}"
                                data-doctor-name="${t.doctor_nume} ${t.doctor_prenume}"
                                data-doctor-prenume="${t.doctor_prenume}"
                                data-doctor-nume="${t.doctor_nume}"
                                data-doctor-spec="${t.doctor_specializare}"
                                data-doctor-location="${t.doctor_locatie}">
                            ${a.split("-")[0]}
                        </button>
                    `).join("")}
                </div>
            </div>
        </div>
    `}function B(t){l=t,console.log("Opening popup with slotInfo:",t),document.getElementById("confirm-doctor-name").textContent=`Dr. ${t.doctorName}`,document.getElementById("confirm-doctor-spec").textContent=t.doctorSpec,document.getElementById("confirm-location").textContent=`${t.doctorLocation}, Clinicum Center`;const e=`${t.doctorPrenume}_${t.doctorNume}.jpg`.toLowerCase(),a=document.getElementById("confirm-doctor-image");a&&(a.src=`./doctors/${e}`,console.log("Setting image to:",`./doctors/${e}`));const o=n.getDate(),r=n.getMonth()+1,i=n.getFullYear();document.getElementById("confirm-date").textContent=`${o}.${r}.${i}`;const c=t.slot.split("-")[0];document.getElementById("confirm-time").textContent=c,document.getElementById("confirmation-popup")?.classList.remove("hidden")}function C(){console.log("Closing confirmation popup"),document.getElementById("confirmation-popup")?.classList.add("hidden"),l=null}async function k(){if(l)try{const t=l.slot.split("-")[0],e=n.getFullYear(),a=String(n.getMonth()+1).padStart(2,"0"),o=String(n.getDate()).padStart(2,"0"),r=`${e}-${a}-${o}T${t}:00`;console.log("Creating programare:",{id_doctor:l.doctorId,data_programare:r,selectedDate:n.toString()});const i=await fetch(`${h}/api/programari`,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({id_doctor:parseInt(l.doctorId),data_programare:r})});if(!i.ok){const c=await i.json();throw new Error(c.message||"Failed to create programare")}alert("Programarea a fost creată cu succes!"),window.location.href="./programari.html",window.location.href="./programari.html"}catch(t){console.error("Error creating programare:",t),alert("Eroare: "+t.message)}}
