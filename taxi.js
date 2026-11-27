const trip = document.querySelector("#trip");
const from = trip.elements.from;
const to = trip.elements.to;
const date = trip.elements.date;
const result = document.querySelector(".trip-result");
const message = document.querySelector("#trip-message");
const status = document.querySelector("#trip-status");

const today = new Date();
const localDay = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
date.min = localDay.toISOString().slice(0, 10);

function resetDraft() {
  result.hidden = true;
  status.textContent = "";
  to.setCustomValidity("");
}

document.querySelector(".trip-swap").addEventListener("click", () => {
  [from.value, to.value] = [to.value, from.value];
  resetDraft();
});

for (const route of document.querySelectorAll("[data-from][data-to]")) {
  route.addEventListener("click", () => {
    from.value = route.dataset.from;
    to.value = route.dataset.to;
    resetDraft();
    date.focus({ preventScroll: true });
    document.querySelector("#widget").scrollIntoView({ block: "start" });
  });
}

trip.addEventListener("input", resetDraft);
trip.addEventListener("submit", (event) => {
  event.preventDefault();
  const departure = from.value.trim();
  const destination = to.value.trim();
  if (!departure || !destination || departure.toLocaleLowerCase("ru") === destination.toLocaleLowerCase("ru")) {
    to.setCustomValidity("Укажите два разных города.");
    to.reportValidity();
    return;
  }

  const [year, month, day] = date.value.split("-");
  const lines = [
    "Здравствуйте! Хочу уточнить стоимость поездки.",
    `Маршрут: ${departure} → ${destination}`,
    `Дата: ${day}.${month}.${year}`,
    `Пассажиры: ${trip.elements.passengers.value}`
  ];
  const note = trip.elements.note.value.trim();
  if (note) lines.push(`Комментарий: ${note}`);
  message.value = lines.join("\n");
  result.hidden = false;
  status.textContent = "Черновик готов. Данные остались на странице.";
  message.focus({ preventScroll: true });
});

document.querySelector("#trip-copy").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(message.value);
    status.textContent = "Текст заявки скопирован.";
  } catch {
    message.focus();
    message.select();
    status.textContent = "Выделил текст. Скопируйте его вручную.";
  }
});
