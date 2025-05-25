
window.onload = function () {
  function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(div => div.classList.add('d-none'));
    document.getElementById(`screen-${screen}`).classList.remove('d-none');
  }

  showScreen('login');
  window.showScreen = showScreen;

  window.registerUser = function () {
    const name = document.getElementById("reg-name").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;

    fetch('backend/register.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `name=${name}&email=${email}&password=${password}`
    })
    .then(res => res.text())
    .then(msg => {
      alert("Registration Successful");
      showScreen('login');
    });
  }

  
window.loginUser = function () {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  fetch('backend/login.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `email=${email}&password=${password}`
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === "success") {
      window.currentUser = data;
      if (data.is_admin) {
        showScreen('admin');
      } else {
        loadSlots();
        loadBookingHistory();
        showScreen('dashboard');
      }
    } else {
      alert("Login failed");
    }
  });
}

window.bookSlot = function (slotId) {
  fetch('backend/book_slot.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `user_id=${window.currentUser.id}&slot_id=${slotId}`
  })
  .then(res => res.text())
  .then(msg => {
    alert(msg);
    loadSlots();
    loadBookingHistory();
  });
}

// Booking history function
window.loadBookingHistory = function () {
  fetch('backend/get_user_bookings.php?user_id=' + window.currentUser.id)
    .then(res => res.json())
    .then(history => {
      const historyList = document.getElementById("booking-history");
      historyList.innerHTML = "";
      if (history.length === 0) {
        historyList.innerHTML = "<li class='list-group-item'>No bookings yet.</li>";
        return;
      }
      history.forEach(entry => {
        const item = document.createElement("li");
        item.className = "list-group-item d-flex justify-content-between align-items-center";
        item.innerHTML = `${entry.slot_name} at ${entry.booking_time}`;
      
        if (entry.booking_id) {
          if (entry.is_checked_in == "0") {
            const btn = document.createElement("button");
            btn.className = "btn btn-sm btn-primary";
            btn.innerText = "Check-in";
            btn.onclick = () => checkIn(entry.booking_id);
            item.appendChild(btn);
          } else {
            const btn = document.createElement("button");
            btn.className = "btn btn-sm btn-danger";
            btn.innerText = "Check-out";
            btn.onclick = () => checkOut(entry.booking_id);
            item.appendChild(btn);
          }
        }
      
        historyList.appendChild(item);
      });
      
    });
}

  // Admin functions
  window.loadAllBookings = function () {
    fetch('backend/get_all_bookings.php')
      .then(res => res.json())
      .then(data => {
        const out = data.map(entry =>
          `<div class="border p-2 mb-2">
            <strong>${entry.name}</strong> (${entry.email})<br>
            Slot: ${entry.slot_name} at ${entry.booking_time}
          </div>`
        ).join("");
        document.getElementById("all-bookings").innerHTML = out;
      });
  }

  window.resetSlots = function () {
    if (confirm("Are you sure you want to reset all slots? This will delete all bookings.")) {
      fetch('backend/reset_slots.php')
        .then(res => res.text())
        .then(msg => {
          alert(msg);
          loadAllBookings();
        });
    }
  }


window.logoutUser = function () {
  window.currentUser = null;
  showScreen('login');
}


// Fix for missing loadSlots
window.loadSlots = function () {
  fetch('backend/get_slots.php')
    .then(res => res.json())
    .then(slots => {
      const slotDiv = document.getElementById("slots");
      slotDiv.innerHTML = "";
      slots.forEach(slot => {
        let card = `<div class="col-md-4">
          <div class="card mb-3">
            <div class="card-body">
              <h5 class="card-title">${slot.slot_name}</h5>
              <p>Status: ${slot.is_booked == 1 ? "Booked" : "Available"}</p>
              <button class="btn btn-${slot.is_booked == 1 ? "secondary" : "primary"}"
                onclick="bookSlot(${slot.id})" ${slot.is_booked == 1 ? "disabled" : ""}>
                Book Slot
              </button>
            </div>
          </div>
        </div>`;
        slotDiv.innerHTML += card;
      });
    });
};
}
window.checkIn = function (booking_id) {
  fetch('backend/check_in.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `booking_id=${booking_id}`
  })
  .then(res => res.text())
  .then(msg => {
    alert(msg);
    loadBookingHistory();
  });
}

window.checkOut = function (booking_id) {
  fetch('backend/check_out.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `booking_id=${booking_id}`
  })
  .then(res => res.text())
  .then(msg => {
    alert(msg);
    loadSlots();
    loadBookingHistory();
  });
}

let selectedSlotId = null;
let selectedSlotName = "";

window.startPayment = function (slotId, slotName) {
  selectedSlotId = slotId;
  selectedSlotName = slotName;
  document.getElementById("pay-slot-name").innerText = slotName;
  showScreen('payment');
}

window.confirmPayment = function () {
  const method = document.querySelector('input[name="paymentMethod"]:checked').value;
  alert("Paid via " + method);
  fetch('backend/book_slot.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `user_id=${window.currentUser.id}&slot_id=${selectedSlotId}`
  })
  .then(res => res.text())
  .then(msg => {
    alert(msg);
    loadSlots();
    loadBookingHistory();
    showScreen('dashboard');
  });
}

window.cancelPayment = function () {
  selectedSlotId = null;
  selectedSlotName = "";
  showScreen('dashboard');
}
