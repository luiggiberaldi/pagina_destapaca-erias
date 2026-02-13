function changeImage(src) {
    document.getElementById('current-image').src = src;
}

// Countdown Timer
function startTimer(duration, display) {
    var timer = duration, hours, minutes, seconds;
    setInterval(function () {
        hours = parseInt(timer / 3600, 10);
        minutes = parseInt((timer % 3600) / 60, 10);
        seconds = parseInt(timer % 60, 10);

        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = hours + ":" + minutes + ":" + seconds;

        if (--timer < 0) {
            timer = duration;
        }
    }, 1000);
}

window.onload = function () {
    var fiveMinutes = 60 * 60 * 1 + 55 * 60 + 5; // 1h 55m 05s
    var display = document.querySelector('#countdown');
    startTimer(fiveMinutes, display);
};

// Modal Logic
const modal = document.getElementById('order-modal');

// Close modal if user clicks outside of it
window.onclick = function (event) {
    if (event.target == modal) {
        closeModal();
    }
}

function openModal() {
    modal.style.display = "flex";
}

function closeModal() {
    modal.style.display = "none";
}

// Attach Open Modal event to ALL CTA buttons
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', (e) => {
        // Prevent default only if it's not the submit button inside the form
        if (!button.classList.contains('form-submit')) {
            e.preventDefault();
            openModal();
        }
    });
});

// COD Zones List
const codZones = [
    "Distrito Capital",
    "Miranda",
    "La Guaira",
    "Carabobo",
    "Aragua",
    "Lara",
    "Yaracuy",
    "Zulia"
];

function checkShippingMethod() {
    const state = document.getElementById('state').value;
    const messageBox = document.getElementById('shipping-message');

    if (codZones.includes(state)) {
        messageBox.style.display = 'block';
        messageBox.style.backgroundColor = '#e8f5e9'; // Light green
        messageBox.style.color = '#2e7d32';
        messageBox.style.border = '1px solid #c8e6c9';
        messageBox.innerHTML = '✅ <strong>¡Excelente!</strong> Tienes delivery <strong>Paga al Recibir</strong> en tu zona.';
    } else if (state === "Otro") {
        messageBox.style.display = 'block';
        messageBox.style.backgroundColor = '#fff3e0'; // Light orange
        messageBox.style.color = '#ef6c00';
        messageBox.style.border = '1px solid #ffe0b2';
        messageBox.innerHTML = '🚚 <strong>Envío Nacional:</strong> Tu pedido será enviado con <strong>Cobro a Destino</strong>.';
    } else {
        messageBox.style.display = 'none';
    }
}

// Bundle Logic
let currentBundle = {
    units: 1,
    price: 19.95,
    name: "1 Unidad"
};

function selectBundle(units, price, name) {
    // Update State
    currentBundle = { units, price, name };

    // Update UI - Highlight Selected Card
    document.querySelectorAll('.bundle-card').forEach(card => {
        card.classList.remove('selected');
    });

    const cards = document.querySelectorAll('.bundle-card');
    if (units === 1) cards[0].classList.add('selected');
    if (units === 2) cards[1].classList.add('selected');
    if (units === 3) cards[2].classList.add('selected');

    // Update Sticky Cart Price
    document.querySelector('.cart-price').textContent = `$${price.toFixed(2)}`;
    document.querySelector('.cart-title').textContent = `RUSH™ (x${units}) | Destapa Cañerias`;

    // Update Modal Summary
    const oldPrice = (30.00 * units).toFixed(2);
    document.getElementById('modal-summary-title').textContent = `RUSH™ | Destapa Cañerias (x${units})`;
    document.getElementById('modal-summary-price').innerHTML = `$${price.toFixed(2)} USD <span class="old-price" id="modal-old-price">$${oldPrice}</span>`;
}

// Handle Checkout Form Submission -> Redirect to WhatsApp
document.getElementById('checkout-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get Values
    const name = document.getElementById('full-name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const state = document.getElementById('state').value;
    const city = document.getElementById('city').value;
    const reference = document.getElementById('reference').value || "N/A";

    // Determine Payment Method Text
    const isCOD = codZones.includes(state);
    const paymentMethod = isCOD ? "Paga al Recibir (COD)" : "Envío Nacional (Cobro a Destino)";

    // Construct WhatsApp Message
    const phoneNumber = "584144124771";
    const message = `
*🔥 ¡NUEVO PEDIDO RUSH!*

*📦 Oferta:* ${currentBundle.name}
*💰 Total:* $${currentBundle.price.toFixed(2)} USD

*👤 Cliente:* ${name}
*📞 Teléfono:* ${phone}

*📍 Dirección de Envío:*
${address}
*Ciudad:* ${city}
*Estado:* ${state}
*Punto de Ref:* ${reference}

*🚚 Método de Envío:* ${paymentMethod}
    `.trim();

    // Encode for URL with %20 instead of + to ensure compatibility
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    // Show processing state
    const submitBtn = document.querySelector('.form-submit');
    submitBtn.innerHTML = '⏳ Abriendo WhatsApp...';
    submitBtn.disabled = true;

    // Redirect
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        submitBtn.innerHTML = '✅ Enviado';

        // Optional: Close modal after a few seconds
        setTimeout(closeModal, 2000);
        submitBtn.innerHTML = 'CONFIRMAR PEDIDO POR WHATSAPP 📲';
        submitBtn.disabled = false;
        // this.reset();
    }, 1000);
});
