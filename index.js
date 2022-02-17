window.addEventListener('DOMContentLoaded', () => {
   const updateDate = () => {
      const dateSpan = document.querySelector("#date");
      const timeSpan = document.querySelector("#time");

      const dt = new Date();

      dateSpan.innerHTML = dt.toLocaleDateString([]);
      timeSpan.innerHTML = dt.toLocaleTimeString([], { timeStyle: "short" });
   };

   window.setInterval(updateDate, 10000);
   updateDate();
});

