document.addEventListener('DOMContentLoaded', () => {
    // --- NOTIFICATION CONFIGURATION ---
    // Chọn phương thức bạn muốn nhận thông báo khi cô ấy nhấn "Đồng ý"
    // Các tùy chọn: 'email', 'discord', 'telegram', 'ntfy', hoặc 'none'
    const NOTIFICATION_CONFIG = {
        type: 'email', // Chọn 'email' để gửi về Gmail của bạn qua Formspree

        // 1. Cấu hình Email qua Formspree (Để nhận thư về thach2548@gmail.com)
        // Hướng dẫn lấy Form ID miễn phí trong 10 giây:
        // B1: Truy cập https://formspree.io đăng ký tài khoản bằng mail thach2548@gmail.com
        // B2: Nhấn "New Form", đặt tên tùy ý. Bạn sẽ có link: https://formspree.io/f/MÃ_CỦA_BẠN
        // B3: Dán phần MÃ_CỦA_BẠN (ví dụ: mwkgpqoz) vào bên dưới:
        formspreeId: 'xykarggw', // Dán mã Form ID của bạn vào đây

        // 2. Cấu hình Discord Webhook
        discordWebhookUrl: '', // Dán URL Discord Webhook của bạn vào đây

        // 3. Cấu hình Telegram Bot (qua @BotFather)
        telegramToken: '', // Token của Bot (vd: 123456:ABC-DEF...)
        telegramChatId: '', // Chat ID của bạn (dùng bot @userinfobot để lấy)

        // 4. Cấu hình ntfy (Cực kỳ đơn giản, không cần đăng ký)
        // Chỉ cần đặt 1 tên kênh (topic) bí mật ở dưới (vd: sinhnhung_henho_2106)
        // Tải ứng dụng ntfy trên điện thoại và đăng ký (subscribe) kênh đó để nhận thông báo đẩy tức thì!
        ntfyTopic: 'sinhnhut_henho_invitation_secret'
    };

    // --- ELEMENT SELECTORS ---
    const envelopeWrapper = document.querySelector('.envelope-wrapper');
    const envelope = document.querySelector('.envelope');
    const waxSeal = document.getElementById('waxSeal');
    const envelopeSection = document.getElementById('envelopeSection');
    const mainContent = document.getElementById('mainContent');
    const successModal = document.getElementById('successModal');
    const btnYes = document.getElementById('btnYes');
    const btnNo = document.getElementById('btnNo');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const dresscodeInput = document.getElementById('dresscodeInput');
    const btnSendDresscode = document.getElementById('btnSendDresscode');

    let rsvpSent = false;

    // --- SEND RSVP NOTIFICATION ---
    function sendRsvpNotification(dresscode) {
        const dressText = dresscode ? `👗 Dresscode cô ấy chọn: ${dresscode}` : "👗 Dresscode: Không điền";
        const message = `🎉 Bé đã đồng ý đi chơi sinh nhật rồi!\n📍 Địa điểm: Chamie Steak\n⏰ Thời gian: 17:00 - Chủ Nhật (21/06)\n${dressText}`;

        // Gửi qua Email (Formspree)
        if (NOTIFICATION_CONFIG.type === 'email' && NOTIFICATION_CONFIG.formspreeId) {
            fetch(`https://formspree.io/f/${NOTIFICATION_CONFIG.formspreeId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    subject: "Lời mời Sinh nhật: Bé đã đồng ý! 🎉",
                    message: "Bé đã đồng ý đi chơi sinh nhật cùng bạn.",
                    time: "17:00 - Chủ Nhật (21/06)",
                    location: "Chamie Steak",
                    dresscode: dresscode || "Chưa chọn hoặc không điền"
                })
            }).catch(err => console.error("Email Notification Error:", err));
        }

        // Gửi qua Discord
        else if (NOTIFICATION_CONFIG.type === 'discord' && NOTIFICATION_CONFIG.discordWebhookUrl) {
            fetch(NOTIFICATION_CONFIG.discordWebhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: `🎉 **Thông báo mới từ thiệp mời!**\n${message}` })
            }).catch(err => console.error("Discord Notification Error:", err));
        }

        // Gửi qua Telegram
        else if (NOTIFICATION_CONFIG.type === 'telegram' && NOTIFICATION_CONFIG.telegramToken && NOTIFICATION_CONFIG.telegramChatId) {
            const url = `https://api.telegram.org/bot${NOTIFICATION_CONFIG.telegramToken}/sendMessage`;
            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: NOTIFICATION_CONFIG.telegramChatId,
                    text: message
                })
            }).catch(err => console.error("Telegram Notification Error:", err));
        }

        // Gửi qua ntfy
        else if (NOTIFICATION_CONFIG.type === 'ntfy' && NOTIFICATION_CONFIG.ntfyTopic) {
            fetch(`https://ntfy.sh/${NOTIFICATION_CONFIG.ntfyTopic}`, {
                method: 'POST',
                headers: {
                    'Title': 'Sinh Nhật Hẹn Hò 🎉',
                    'Priority': 'high',
                    'Tags': 'tada,heart,dress'
                },
                body: message
            }).catch(err => console.error("ntfy Notification Error:", err));
        }
    }

    // --- ENVELOPE OPENING PROCESS ---
    let envelopeOpened = false;

    function openEnvelope() {
        if (envelopeOpened) return;
        envelopeOpened = true;

        // Add class to play CSS animations (flap opens, letter slides up)
        envelopeWrapper.classList.add('open');

        // Wait for envelope animations to finish (approx 1.2s), then reveal main content
        setTimeout(() => {
            envelopeSection.classList.add('hidden');
            envelopeSection.classList.remove('active');

            mainContent.classList.remove('hidden');
            mainContent.classList.add('active');

            // Trigger a soft initial confetti burst to celebrate
            triggerInitialCelebration();
        }, 1200);
    }

    waxSeal.addEventListener('click', (e) => {
        e.stopPropagation(); // Avoid double triggers
        openEnvelope();
    });

    envelope.addEventListener('click', openEnvelope);



    // --- FLOATING HEARTS CANVAS ANIMATION ---
    const canvas = document.getElementById('heartCanvas');
    const ctx = canvas.getContext('2d');

    let hearts = [];
    const colors = ['rgba(255, 42, 95, 0.6)', 'rgba(255, 74, 125, 0.45)', 'rgba(180, 50, 255, 0.35)', 'rgba(255, 0, 128, 0.45)'];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Heart {
        constructor() {
            this.reset();
            // Start at random Y values initially so they don't all rise from the bottom together
            this.y = Math.random() * canvas.height;
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 20;
            this.size = Math.random() * 12 + 6;
            this.speedY = Math.random() * 1.2 + 0.4;
            this.speedX = Math.random() * 0.6 - 0.3;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            // Drift left/right slightly
            this.speedX += Math.random() * 0.1 - 0.05;
            this.speedX = Math.max(-0.6, Math.min(0.6, this.speedX));

            if (this.y < -20 || this.x < -20 || this.x > canvas.width + 20) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();

            const x = this.x;
            const y = this.y;
            const size = this.size;

            ctx.moveTo(x, y);
            // Drawing heart shape using cubic bezier curves
            ctx.bezierCurveTo(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
            ctx.bezierCurveTo(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);

            ctx.fill();
            ctx.restore();
        }
    }

    // Initialize heart particles
    const maxHearts = 45;
    for (let i = 0; i < maxHearts; i++) {
        hearts.push(new Heart());
    }

    function animateHearts() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        hearts.forEach(heart => {
            heart.update();
            heart.draw();
        });

        requestAnimationFrame(animateHearts);
    }
    animateHearts();

    // --- EVASIVE "NO" BUTTON (FLEEING LOGIC) ---
    function flee(e) {
        // Mark button as fleeing so it gets fixed/fixed positioning and transitions
        if (!btnNo.classList.contains('fleeing')) {
            btnNo.classList.add('fleeing');
        }

        const padding = 40;
        const btnWidth = btnNo.offsetWidth;
        const btnHeight = btnNo.offsetHeight;

        // Calculate maximum bounds in viewport
        const maxX = window.innerWidth - btnWidth - padding;
        const maxY = window.innerHeight - btnHeight - padding;

        // Generate random coordinates
        let newX = Math.random() * (maxX - padding) + padding;
        let newY = Math.random() * (maxY - padding) + padding;

        // Ensure it doesn't immediately overlap the cursor/finger position
        let clientX = 0, clientY = 0;
        if (e.type === 'touchstart') {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const dist = Math.hypot(newX - clientX, newY - clientY);
        // If distance is too close, push it further away
        if (dist < 150) {
            newX = (newX + 200) % maxX;
            newY = (newY + 200) % maxY;
            if (newX < padding) newX = padding;
            if (newY < padding) newY = padding;
        }

        btnNo.style.left = `${newX}px`;
        btnNo.style.top = `${newY}px`;
    }

    btnNo.addEventListener('mouseenter', flee);
    btnNo.addEventListener('mouseover', flee);
    btnNo.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Stop default touch clicks
        flee(e);
    });

    // --- "YES" BUTTON & CELEBRATION ---
    function triggerInitialCelebration() {
        confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#ff2a5f', '#ff4a7d', '#b432ff', '#ffffff']
        });
    }

    function triggerSuccessCelebration() {
        // Continuous burst for 3 seconds
        const end = Date.now() + 3000;
        const colors = ['#ff2a5f', '#ff4a7d', '#b8143d', '#ffffff', '#b432ff'];

        (function frame() {
            confetti({
                particleCount: 4,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 4,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());

        // Center explosion
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: colors
        });
    }

    btnYes.addEventListener('click', () => {
        // Show success modal immediately
        successModal.classList.remove('hidden');

        // Trigger large explosion of confetti
        triggerSuccessCelebration();
    });

    // --- SEND DRESSCODE & RSVP ---
    if (btnSendDresscode) {
        btnSendDresscode.addEventListener('click', () => {
            if (rsvpSent) return;
            rsvpSent = true;

            const dresscodeVal = dresscodeInput ? dresscodeInput.value.trim() : '';
            sendRsvpNotification(dresscodeVal);

            btnSendDresscode.innerHTML = "Đã gửi! ✓";
            btnSendDresscode.style.background = "#28a745"; // Green success color
            btnSendDresscode.style.borderColor = "#28a745";
            btnSendDresscode.disabled = true;

            setTimeout(() => {
                successModal.classList.add('hidden');
            }, 800);
        });
    }

    // --- CLOSE MODAL ONLY (CHỐT KÈO) ---
    btnCloseModal.addEventListener('click', () => {
        successModal.classList.add('hidden');
    });
});
