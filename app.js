const jobs = [
  { id: 1, title: "Junior Developer", area: "sistemas", mode: "presencial", partTime: true, firstJob: true, salary: 800, x: 40, y: 48, state: "new", office: "Tech Hub Centro" },
  { id: 2, title: "Soporte TI", area: "sistemas", mode: "remoto", partTime: false, firstJob: true, salary: 700, x: 62, y: 30, state: "new", office: "Remote Labs" },
  { id: 3, title: "Veterinario Junior", area: "oftalmologia", mode: "presencial", partTime: true, firstJob: false, salary: 900, x: 73, y: 68, state: "new", office: "VetVision" }
];

const state = { selected: null, radius: 5 };
const map = document.getElementById("map");
const details = document.getElementById("details");
const resultsCount = document.getElementById("resultsCount");

const controls = {
  area: document.getElementById("areaFilter"),
  mode: document.getElementById("modeFilter"),
  partTime: document.getElementById("partTimeFilter"),
  firstJob: document.getElementById("firstJobFilter"),
  radius: document.getElementById("radiusFilter")
};

function matchesFilters(job){
  if (controls.area.value !== "all" && job.area !== controls.area.value) return false;
  if (controls.mode.value !== "all" && job.mode !== controls.mode.value) return false;
  if (controls.partTime.checked && !job.partTime) return false;
  if (controls.firstJob.checked && !job.firstJob) return false;
  return true;
}

function renderMap(){
  map.querySelectorAll('.pin,.bubble').forEach(el=>el.remove());
  const visible = jobs.filter(matchesFilters);
  resultsCount.textContent = `${visible.length} vacantes encontradas`;
  visible.forEach(job => {
    const pin = document.createElement('button');
    pin.className = `pin ${job.state === 'review' ? 'review' : ''} ${job.state === 'hired' ? 'hired' : ''}`;
    pin.style.left = `${job.x}%`;
    pin.style.top = `${job.y}%`;
    pin.title = `${job.title} - $${job.salary}`;

    const bubble = document.createElement('span');
    bubble.className = 'bubble';
    bubble.style.left = `${job.x}%`;
    bubble.style.top = `${job.y}%`;
    bubble.textContent = job.title;

    pin.onclick = () => openJob(job.id);
    map.append(pin, bubble);
  });
}

function openJob(id){
  const job = jobs.find(j=>j.id===id);
  state.selected = job;
  details.innerHTML = `
    <h2>${job.title}</h2>
    <p><strong>Empresa:</strong> ${job.office}</p>
    <p><strong>Video:</strong> Saludo del equipo (15s) 🎬</p>
    <p><strong>Fotos:</strong> Oficina moderna + equipo real 📸</p>
    <p><strong>Estado:</strong> ${job.state === 'review' ? 'En revisión' : job.state === 'hired' ? 'Contratado' : 'Disponible'}</p>
    <a href="#" class="salary" id="applySalary">Aplicar por $${job.salary}</a>
  `;
  document.getElementById('applySalary').onclick = (e)=>{e.preventDefault();document.getElementById('applyDialog').showModal();};
}

Object.values(controls).forEach(ctrl => ctrl.addEventListener('change', () => {
  document.getElementById('radiusValue').textContent = `${controls.radius.value} km`;
  renderMap();
}));

document.getElementById('applyForm').addEventListener('submit', (e) => {
  const form = e.target;
  if(!form.checkValidity()) return;
  if (!state.selected) return;
  state.selected.state = 'review';
  document.getElementById('testDialog').showModal();
  renderMap();
  openJob(state.selected.id);
});

document.getElementById('courseBtn').onclick = () => {
  alert('Curso agregado al perfil. ¡Ahora tu match es 100%!');
};

document.getElementById('notifyBtn').onclick = () => {
  if (!state.selected) return alert('Primero abre una vacante.');
  state.selected.state = 'hired';
  renderMap();
  details.innerHTML = `<h2>¡Match!</h2><p>La empresa quiere una entrevista. Ruta marcada a la oficina de ${state.selected.office}.</p>`;
};

renderMap();
