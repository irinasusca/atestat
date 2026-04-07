import{r as v,u as S,A as h}from"./auth-BI3OkvaQ.js";let p=[],u=[],a=new Date,g=[],l=null;const b=["ianuarie","februarie","martie","aprilie","mai","iunie","iulie","august","septembrie","octombrie","noiembrie","decembrie"],L=["Duminică","Luni","Marți","Miercuri","Joi","Vineri","Sâmbătă"];document.addEventListener("DOMContentLoaded",async()=>{await v(),await S();const t=sessionStorage.getItem("selectedSpecialitati"),e=sessionStorage.getItem("selectedLocatii");t&&(p=JSON.parse(t)),e&&(u=JSON.parse(e)),f(),x(),await $()});function x(){document.getElementById("date-picker-btn")?.addEventListener("click",D),document.getElementById("close-date-picker")?.addEventListener("click",y),document.getElementById("date-input")?.addEventListener("change",w),document.getElementById("confirm-booking-btn")?.addEventListener("click",C),document.getElementById("close-popup-btn")?.addEventListener("click",k),document.getElementById("date-picker-popup")?.addEventListener("click",t=>{t.target.id==="date-picker-popup"&&y()})}function D(){const t=document.getElementById("date-picker-popup"),e=document.getElementById("date-input"),n=new Date,o=n.getFullYear(),i=String(n.getMonth()+1).padStart(2,"0"),r=String(n.getDate()).padStart(2,"0");e.min=`${o}-${i}-${r}`;const c=a.getFullYear(),s=String(a.getMonth()+1).padStart(2,"0"),d=String(a.getDate()).padStart(2,"0");e.value=`${c}-${s}-${d}`,t?.classList.remove("hidden")}function y(){document.getElementById("date-picker-popup")?.classList.add("hidden")}function w(t){const e=t.target;a=new Date(e.value+"T00:00:00"),f(),y(),$()}function f(){const t=L[a.getDay()],e=a.getDate(),n=b[a.getMonth()],o=document.getElementById("selected-date-text");o&&(o.textContent=`${t}, ${e} ${n}`)}async function $(){const t=document.getElementById("loading-state"),e=document.getElementById("empty-state"),n=document.getElementById("slots-container");try{t?.classList.remove("hidden"),n?.classList.add("hidden"),e?.classList.add("hidden");const o=a.getDay(),i=a.getFullYear(),r=String(a.getMonth()+1).padStart(2,"0"),c=String(a.getDate()).padStart(2,"0"),s=`${i}-${r}-${c}`,d=await fetch(`${h}/api/programari/available`,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({locatii:u.length>0?u:null,specializari:p.length>0?p:null,zi_saptamana:o,data_programare:s})});if(!d.ok){const m=await d.json();throw console.error("Error response:",m),new Error(m.message||"Failed to load available slots")}g=await d.json(),g.length===0?e?.classList.remove("hidden"):(B(),n?.classList.remove("hidden"))}catch(o){console.error("Error loading available slots:",o),alert("Eroare la încărcarea intervalelor disponibile: "+o.message),e?.classList.remove("hidden")}finally{t?.classList.add("hidden")}}function B(){const t=document.getElementById("slots-container");t&&(t.innerHTML=g.map(e=>I(e)).join(""),document.querySelectorAll(".time-slot-btn").forEach(e=>{e.addEventListener("click",n=>{const o=n.target,i=o.dataset.doctorId,r=o.dataset.slot,c=o.dataset.doctorName,s=o.dataset.doctorPrenume,d=o.dataset.doctorNume,m=o.dataset.doctorSpec,E=o.dataset.doctorLocation;_({doctorId:i,slot:r,doctorName:c,doctorPrenume:s,doctorNume:d,doctorSpec:m,doctorLocation:E})})}))}function I(t){return`
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
                    ${t.slots.map(n=>`
                        <button class="time-slot-btn bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                                data-doctor-id="${t.doctor_id}"
                                data-slot="${n}"
                                data-doctor-name="${t.doctor_nume} ${t.doctor_prenume}"
                                data-doctor-prenume="${t.doctor_prenume}"
                                data-doctor-nume="${t.doctor_nume}"
                                data-doctor-spec="${t.doctor_specializare}"
                                data-doctor-location="${t.doctor_locatie}">
                            ${n.split("-")[0]}
                        </button>
                    `).join("")}
                </div>
            </div>
        </div>
    `}function _(t){l=t,document.getElementById("confirm-doctor-name").textContent=`Dr. ${t.doctorName}`,document.getElementById("confirm-doctor-spec").textContent=t.doctorSpec,document.getElementById("confirm-location").textContent=`${t.doctorLocation}, Clinicum Center`;const e=`${t.doctorPrenume}_${t.doctorNume}.jpg`.toLowerCase(),n=document.getElementById("confirm-doctor-image");n&&(n.src=`./doctors/${e}`);const o=a.getDate(),i=a.getMonth()+1,r=a.getFullYear();document.getElementById("confirm-date").textContent=`${o}.${i}.${r}`;const c=t.slot.split("-")[0];document.getElementById("confirm-time").textContent=c,document.getElementById("confirmation-popup")?.classList.remove("hidden")}function k(){document.getElementById("confirmation-popup")?.classList.add("hidden"),l=null}async function C(){if(l)try{const t=l.slot.split("-")[0],e=a.getFullYear(),n=String(a.getMonth()+1).padStart(2,"0"),o=String(a.getDate()).padStart(2,"0"),i=`${e}-${n}-${o}T${t}:00`,r=await fetch(`${h}/api/programari`,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({id_doctor:parseInt(l.doctorId),data_programare:i})});if(!r.ok){const c=await r.json();throw new Error(c.message||"Failed to create programare")}alert("Programarea a fost creată cu succes!"),window.location.href="./programari.html",window.location.href="./programari.html"}catch(t){console.error("Error creating programare:",t),alert("Eroare: "+t.message)}}
