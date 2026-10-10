// ===== ระบบ Tips =====
const tips = [
    "💡 กด F1 เพื่อดูคำสั่งต่างๆ",
    "💡 กด Q เพื่อเปิดเมนู Spawn",
    "💡 กด C เพื่อเปิด Context Menu",
    "💡 กด T เพื่อพิมพ์แชท",
    "💡 อย่าลืมอ่านกฎของเซิร์ฟเวอร์",
    "💡 กด F2 เพื่อดูสกอร์บอร์ด",
    "💡 ใช้ปุ่ม Alt เพื่อเดินช้าๆ",
    "💡 กด E เพื่อใช้/หยิบของ"
];

function showRandomTip() {
    const tipEl = document.getElementById('tipText');
    if (tipEl) {
        tipEl.textContent = tips[Math.floor(Math.random() * tips.length)];
    }
}

// ===== อ่านพารามิเตอร์จาก URL =====
// GMod ส่งค่ามาในรูปแบบ: ?steamid=xxx&name=xxx&map=xxx&ip=xxx
function getURLParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const pairs = queryString.split('&');
    
    for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i].split('=');
        if (pair[0]) {
            params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
        }
    }
    return params;
}

// ===== ตัวแปรโหลด =====
let progress = 0;
let isLoading = true;

// ===== อัปเดต Progress =====
// หมายเหตุ: GMod ไม่ได้ส่ง % จริงมาให้ ต้องจำลองเอง
function startProgressAnimation() {
    if (!isLoading) return;
    
    // เพิ่มช้าๆ แบบสุ่ม ไม่ให้ถึง 100 จนกว่าจะโหลดจริง
    if (progress < 95) {
        progress += Math.random() * 2;
        if (progress > 95) progress = 95;
        
        const fill = document.getElementById('progressFill');
        const status = document.getElementById('status');
        
        if (fill) fill.style.width = progress + '%';
        if (status) status.textContent = 'กำลังโหลด... ' + Math.floor(progress) + '%';
        
        setTimeout(startProgressAnimation, 150 + Math.random() * 200);
    }
}

// ===== ฟังก์ชันที่ Lua เรียกได้ (ผ่าน loading URL parameters) =====
function SetStatus(text) {
    const status = document.getElementById('status');
    if (status) status.textContent = text;
}

function SetProgress(percent) {
    const fill = document.getElementById('progressFill');
    if (fill) fill.style.width = percent + '%';
    progress = percent;
}

// ===== เริ่มต้นทำงาน =====
window.addEventListener('load', function() {
    const params = getURLParams();
    
    // ตั้งชื่อเซิร์ฟเวอร์
    if (params.servername) {
        document.getElementById('serverName').textContent = params.servername;
    }
    
    // แสดงชื่อผู้เล่น
    if (params.name) {
        document.getElementById('playerName').textContent = params.name;
        document.getElementById('playerInfo').style.display = 'block';
    }
    
    // เล่นเพลงถ้ามี
    // (ต้องมี autoplay policy - GMod อนุญาต)
    
    // เริ่มแอนิเมชัน progress
    startProgressAnimation();
    
    // แสดง tip
    showRandomTip();
    setInterval(showRandomTip, 5000);
    
    // เมื่อโหลดเสร็จ (GMod จะเปลี่ยนหน้าเอง)
    setTimeout(function() {
        isLoading = false;
        SetProgress(100);
        SetStatus('พร้อมเข้าสู่เกม!');
    }, 30000); // สูงสุด 30 วินาที
});