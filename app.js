const jobs = [
  { id: 1, title: "Junior Developer", area: "sistemas", mode: "presencial", partTime: true, firstJob: true, salary: 800, x: 40, y: 48, state: "new", office: "Tech Hub Centro", logo: "💻" },
  { id: 2, title: "Soporte TI", area: "sistemas", mode: "remoto", partTime: false, firstJob: true, salary: 700, x: 62, y: 30, state: "new", office: "Remote Labs", logo: "🛠️" },
  { id: 3, title: "Veterinario Junior", area: "oftalmologia", mode: "presencial", partTime: true, firstJob: false, salary: 900, x: 73, y: 68, state: "new", office: "VetVision", logo: "🐾" }
];
const map = document.getElementById("map"), details = document.getElementById("details"), resultsCount = document.getElementById("resultsCount");
const controls = { area: areaFilter, mode: modeFilter, partTime: partTimeFilter, firstJob: firstJobFilter, radius: radiusFilter };
const state = { selected: null };

const matchesFilters = (job) => !(controls.area.value !== "all" && job.area !== controls.area.value || controls.mode.value !== "all" && job.mode !== controls.mode.value || controls.partTime.checked && !job.partTime || controls.firstJob.checked && !job.firstJob);

function renderMap(){
  map.querySelectorAll('.pin,.bubble').forEach(el=>el.remove());
  const visible = jobs.filter(matchesFilters); resultsCount.textContent = `${visible.length} vacantes encontradas`;
  visible.forEach(job => {
    const pin = document.createElement('button'); pin.className = `pin ${job.state === 'review' ? 'review' : ''} ${job.state === 'hired' ? 'hired' : ''}`;
    pin.style.left = `${job.x}%`; pin.style.top = `${job.y}%`; pin.title = `${job.title} - $${job.salary}`;
    const bubble = document.createElement('span'); bubble.className = 'bubble'; bubble.style.left = `${job.x}%`; bubble.style.top = `${job.y}%`; bubble.textContent = `${job.logo} ${job.title}`;
    pin.onclick = () => openJob(job.id); map.append(pin, bubble);
  });
}

function openJob(id){
  const job = jobs.find(j=>j.id===id); state.selected = job;
  details.innerHTML = `<h2>${job.logo} ${job.title}</h2><p><strong>Empresa:</strong> ${job.office}</p><p><strong>Video:</strong> Saludo del equipo (15s) 🎬</p>
  <div class="job-media"><img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&q=80" alt="Oficina"/><img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&q=80" alt="Equipo"/></div>
  <p><strong>Estado:</strong> ${job.state === 'review' ? 'En revisión' : job.state === 'hired' ? 'Contratado' : 'Disponible'}</p><a href="#" class="salary" id="applySalary">💸 Aplicar por $${job.salary}</a>`;
  applySalary.onclick = (e)=>{e.preventDefault(); applyDialog.showModal();};
}
Object.values(controls).forEach(ctrl => ctrl.addEventListener('change', () => { radiusValue.textContent = `${controls.radius.value} km`; renderMap(); }));
applyForm.addEventListener('submit', (e) => { if(!e.target.checkValidity() || !state.selected) return; state.selected.state = 'review'; testDialog.showModal(); renderMap(); openJob(state.selected.id); });
courseBtn.onclick = () => alert('Curso agregado al perfil. ¡Ahora tu match es 100%!');
notifyBtn.onclick = () => { if (!state.selected) return alert('Primero abre una vacante.'); state.selected.state = 'hired'; renderMap(); details.innerHTML = `<h2>🎉 ¡Match!</h2><p>La empresa quiere una entrevista. Ruta marcada a la oficina de ${state.selected.office}.</p>`; };
renderMap();
