(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const blooms = window.BLOOMS;
  const dialog = $('#gift-dialog');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let activeBloom = blooms[0];
  let busy = false;
  let svgCounter = 0;
  let toastTimer;
  let lastChoice;

  function flowerHead(type, x, y, scale, rotation = 0, uid = '') {
    let shape = '';
    if (type === 'love') {
      shape = `<path d="M-26-15Q-36 20 0 35Q36 20 26-15L9-4 0-24-10-4Z" fill="url(#pink${uid})"/><path d="M-26-15Q-19 19 0 35Q-10 8-10-4Z" fill="#e879a0"/><path d="M26-15Q26 18 0 35Q10 6 9-4Z" fill="#c9517e"/><path d="M-6-8Q-5 14 0 26" fill="none" stroke="#ffc5d5" stroke-width="2" opacity=".6"/>`;
    } else if (type === 'luck') {
      shape = Array.from({length:13}, (_,i) => `<ellipse cy="-24" rx="8" ry="19" fill="${i%2 ? '#f5c448' : '#efad2c'}" transform="rotate(${i*360/13})"/>`).join('') + `<circle r="19" fill="url(#brown${uid})"/><circle r="12" fill="none" stroke="#bd8650" stroke-width="2" stroke-dasharray="1 4"/><circle r="6" fill="#7f523c"/>`;
    } else if (type === 'confidence') {
      shape = Array.from({length:12}, (_,i) => `<ellipse cy="-19" rx="7" ry="17" fill="${i%2 ? '#fffdf3' : '#eeeadd'}" stroke="#dcdccf" stroke-width=".5" transform="rotate(${i*30})"/>`).join('') + '<circle r="10" fill="#e8b333"/><circle cx="-2" cy="-2" r="6" fill="#f5cd58"/>';
    } else {
      shape = '<path d="M0 15V-68" stroke="#76906c" stroke-width="3"/>' + Array.from({length:7},(_,i)=>`<ellipse cx="${i%2 ? 5 : -5}" cy="${5-i*10}" rx="7" ry="11" fill="${['#a18ac3','#b29bce','#8972ae'][i%3]}" transform="rotate(${i%2 ? 28 : -28} ${i%2 ? 5 : -5} ${5-i*10})"/>`).join('') + '<ellipse cy="-64" rx="5" ry="9" fill="#bba8d4"/>';
    }
    return `<g transform="translate(${x} ${y}) rotate(${rotation}) scale(${scale})">${shape}</g>`;
  }

  function bouquet(type) {
    const uid = ++svgCounter;
    const configs = type === 'peace' ? [[90,104,.8,-27],[124,77,1,-12],[163,82,.95,12],[190,107,.75,27],[143,112,.8,0]] : [[91,85,.77,-22],[139,60,.88,-7],[188,85,.77,22],[120,117,.8,-12],[164,119,.8,16]];
    const stems = configs.map(([x,y])=>`<path d="M145 256Q${x+10} 175 ${x} ${y+16}" fill="none" stroke="#65896b" stroke-width="4" stroke-linecap="round"/>`).join('');
    const heads = configs.map(([x,y,s,r])=>flowerHead(type,x,y,s,r,uid)).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 310" role="img" aria-label="Bó ${blooms.find(b=>b.id===type).flower}"><defs><linearGradient id="pink${uid}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8b8cf"/><stop offset="1" stop-color="#d36791"/></linearGradient><radialGradient id="brown${uid}"><stop stop-color="#b5814b"/><stop offset="1" stop-color="#77513d"/></radialGradient><linearGradient id="paper${uid}" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#f4dfba"/><stop offset=".5" stop-color="#e5c99f"/><stop offset="1" stop-color="#d4b28c"/></linearGradient><linearGradient id="front${uid}" x1="0" x2="1"><stop stop-color="#f6e6c8"/><stop offset="1" stop-color="#e3c49c"/></linearGradient></defs><ellipse cx="145" cy="293" rx="49" ry="7" fill="#665940" opacity=".1"/><path d="M57 137L143 286 225 137 169 161 135 134 103 158Z" fill="url(#paper${uid})"/>${stems}<g fill="#759373"><path d="M137 224Q73 201 77 157Q119 171 137 224"/><path d="M148 223Q208 184 209 145Q166 158 148 223"/><path d="M123 166Q85 143 70 118Q102 119 123 166"/><path d="M164 176Q183 127 211 118Q206 155 164 176"/></g><g fill="#a0b496"><path d="M137 201Q104 174 104 145Q134 163 137 201"/><path d="M154 207Q170 166 191 161Q185 193 154 207"/></g>${heads}<path d="M60 149L136 284 151 247 113 190Z" fill="url(#front${uid})"/><path d="M221 149L154 286 136 249 176 191Z" fill="url(#front${uid})"/><path d="M136 249L113 190 135 225 174 192 151 247 154 286Z" fill="#f0d9b6"/><path d="M127 244Q145 252 163 241" fill="none" stroke="#b47082" stroke-width="5"/><path d="M145 248Q111 226 114 244Q119 260 145 248Q173 222 175 239Q174 256 145 248L130 274M145 248L161 273" fill="none" stroke="#c77e91" stroke-width="3" stroke-linecap="round"/><path d="M63 151L128 270M218 153L161 274" stroke="#fff2d8" stroke-width="1.5" fill="none" opacity=".6"/></svg>`;
  }

  $('#display-bouquet').innerHTML = bouquet('love');
  $('#choices').innerHTML = blooms.map((b,i)=>`<button class="choice" data-bloom="${b.id}" style="--bg:${b.background}" aria-label="Nhận hoa ${b.flower} — ${b.need}"><span class="choice-number">0${i+1}</span><span class="choice-en">${b.en}</span><div class="choice-art" aria-hidden="true">${bouquet(b.id)}</div><h3>${b.need}</h3><p>${b.subtitle}</p><span class="choice-arrow" aria-hidden="true">↗</span></button>`).join('');

  function goToChoices() {
    $('#choose').scrollIntoView({behavior: reducedMotion.matches ? 'instant' : 'smooth', block:'start'});
    $('#choices button').focus({preventScroll:true});
  }
  $('#start').addEventListener('click',goToChoices);
  $('#machine-go').addEventListener('click',goToChoices);

  function notify(message) {
    clearTimeout(toastTimer);
    const status = $('#status');
    (dialog.open ? dialog : document.body).append(status);
    status.textContent = message;
    status.classList.add('visible');
    toastTimer = setTimeout(()=>status.classList.remove('visible'),4200);
  }

  async function reveal(bloom, button) {
    if (busy) return;
    busy = true;
    lastChoice = button;
    activeBloom = bloom;
    document.querySelectorAll('.choice').forEach(el=>el.disabled=true);
    $('#choices').setAttribute('aria-busy','true');
    $('#display-bouquet').innerHTML = bouquet(bloom.id);
    $('#slot-text').textContent = 'GÓI GHÉM MỘT CHÚT DỊU DÀNG…';
    $('#machine').classList.add('dispensing');
    $('#status').setAttribute('aria-live','polite');
    notify('Tiệm đang gói hoa cho bạn…');
    await new Promise(resolve=>setTimeout(resolve,reducedMotion.matches ? 0 : 850));
    dialog.style.setProperty('--card-bg',bloom.background);
    dialog.style.setProperty('--card-ink',bloom.ink);
    $('#result-bouquet').innerHTML = bouquet(bloom.id);
    $('#card-kicker').textContent = `${bloom.en} / ${bloom.need.toLocaleUpperCase('vi')}`;
    $('#gift-title').textContent = bloom.flower;
    $('#wish').textContent = bloom.wish;
    $('#machine').classList.remove('dispensing');
    $('#slot-text').textContent = 'YOUR BLOOM IS READY — WITH LOVE';
    $('#status').classList.remove('visible');
    dialog.showModal();
    $('#petals').innerHTML = reducedMotion.matches ? '' : Array.from({length:14},(_,i)=>`<i class="petal" style="left:${(i*7+5)%95}%;--petal:${bloom.color};animation-delay:${i*.065}s;transform:rotate(${i*37}deg)"></i>`).join('');
    busy = false;
    $('#choices').removeAttribute('aria-busy');
    document.querySelectorAll('.choice').forEach(el=>el.disabled=false);
  }
  $('#choices').addEventListener('click',event=>{
    const button = event.target.closest('[data-bloom]');
    if(button) reveal(blooms.find(b=>b.id===button.dataset.bloom),button);
  });
  $('#close-dialog').addEventListener('click',()=>dialog.close());
  $('#try-again').addEventListener('click',()=>{dialog.close();goToChoices();});
  dialog.addEventListener('keydown',event=>{
    if(event.key!=='Tab')return;
    const controls=[...dialog.querySelectorAll('button:not(:disabled), a[href], [tabindex="0"]')];
    const first=controls[0],last=controls[controls.length-1];
    if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}
  });
  dialog.addEventListener('click',event=>{
    if(event.target!==dialog) return;
    const rect=dialog.getBoundingClientRect();
    if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom) dialog.close();
  });
  dialog.addEventListener('close',()=>{
    $('#petals').innerHTML='';
    document.body.append($('#status'));
    $('#status').classList.remove('visible');
    lastChoice?.focus({preventScroll:true});
  });

  const shareText = b => `${b.flower} — Một chút ${b.need.toLocaleLowerCase('vi')} dành cho bạn.\n\n${b.wish}\n\nHappy Vietnamese Women's Day — 20.10\nBLOOM FOR YOU`;
  async function copyWish(bloom = activeBloom) {
    const text=shareText(bloom);
    try {
      let copied=false;
      if(navigator.clipboard && window.isSecureContext) {
        try {await navigator.clipboard.writeText(text);copied=true;} catch { /* Try the local-file / permission fallback below. */ }
      }
      if(!copied) {
        const previousFocus=document.activeElement;
        const area=document.createElement('textarea');
        area.value=text;area.style.cssText='position:fixed;left:0;top:0;opacity:0';
        (dialog.open ? dialog : document.body).append(area);area.focus();area.select();
        copied=document.execCommand('copy');area.remove();previousFocus?.focus({preventScroll:true});
        if(!copied) throw new Error('Clipboard unavailable');
      }
      notify('Đã sao chép lời chúc. Gửi một chút dịu dàng đi nhé!');
      return true;
    } catch {
      notify('Chưa thể sao chép tự động. Bạn có thể chọn và sao chép lời chúc trên thiệp.');
      return false;
    }
  }
  $('#copy').addEventListener('click',()=>copyWish());

  function wrapText(ctx,text,x,y,maxWidth,lineHeight) {
    let line='';
    for(const word of text.split(/\s+/)) {
      const next=line ? `${line} ${word}` : word;
      if(ctx.measureText(next).width>maxWidth && line) {ctx.fillText(line,x,y);line=word;y+=lineHeight;} else line=next;
    }
    if(line)ctx.fillText(line,x,y);
    return y;
  }

  async function createCard(bloom) {
    // Native canvas + self-contained SVG: no external image, CORS or paid API.
    if(document.fonts) await document.fonts.ready;
    const canvas=document.createElement('canvas');canvas.width=1600;canvas.height=2000;
    const ctx=canvas.getContext('2d');
    if(!ctx)throw new Error('Canvas unavailable');
    ctx.fillStyle=bloom.background;ctx.fillRect(0,0,1600,2000);
    ctx.strokeStyle=bloom.ink;ctx.globalAlpha=.2;ctx.lineWidth=2;ctx.strokeRect(42,42,1516,1916);ctx.globalAlpha=1;
    ctx.fillStyle=bloom.ink;ctx.textAlign='left';ctx.font='bold 51px "DM Sans", Arial, sans-serif';ctx.fillText('bloom for you®',100,140);
    ctx.textAlign='right';ctx.font='22px "Be Vietnam Pro", Arial, sans-serif';ctx.fillText('A LITTLE GIFT / 20.10',1500,133);
    const svgBlob=new Blob([bouquet(bloom.id)],{type:'image/svg+xml;charset=utf-8'});
    const imageUrl=URL.createObjectURL(svgBlob);
    try {
      const image=new Image();
      await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=reject;image.src=imageUrl;});
      ctx.drawImage(image,360,190,880,975);
    } finally {URL.revokeObjectURL(imageUrl);}
    ctx.fillStyle=bloom.ink;ctx.textAlign='center';ctx.font='24px "Be Vietnam Pro", Arial, sans-serif';ctx.fillText(bloom.en,800,1215);
    ctx.font='76px Georgia, "Be Vietnam Pro", serif';ctx.fillText(bloom.flower,800,1330);
    ctx.font='34px "Be Vietnam Pro", Arial, sans-serif';
    const endY=wrapText(ctx,bloom.wish,800,1440,1190,59);
    const ruleY=Math.max(1770,endY+90);
    ctx.globalAlpha=.5;ctx.fillRect(730,ruleY,140,2);ctx.globalAlpha=1;
    ctx.font='28px "Be Vietnam Pro", Arial, sans-serif';ctx.fillText("Happy Vietnamese Women's Day — 20.10",800,ruleY+70);
    ctx.font='19px "Be Vietnam Pro", Arial, sans-serif';ctx.fillText('WITH LOVE, BLOOM FOR YOU',800,ruleY+125);
    return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob ? resolve(blob) : reject(new Error('PNG encoding failed')),'image/png'));
  }
  function saveBlob(blob,name) {
    const url=URL.createObjectURL(blob);
    const anchor=document.createElement('a');anchor.href=url;anchor.download=name;document.body.append(anchor);anchor.click();anchor.remove();
    setTimeout(()=>URL.revokeObjectURL(url),30000);
  }
  $('#download').addEventListener('click',async()=>{
    const button=$('#download');button.disabled=true;
    try {saveBlob(await createCard(activeBloom),`bloom-for-you-${activeBloom.id}-20-10.png`);notify('Thiệp PNG đã sẵn sàng trong thư mục tải xuống của bạn.');}
    catch(error) {console.error('PNG export:',error);notify('Chưa thể tạo ảnh. Vui lòng thử tải thiệp lại.');}
    finally {button.disabled=false;}
  });
  $('#share').addEventListener('click',async()=>{
    const button=$('#share');button.disabled=true;
    const bloom=activeBloom;
    try {
      if(!navigator.share) {await copyWish(bloom);return;}
      // Invoke sharing during the click gesture; preparing an image first can expire mobile user activation.
      await navigator.share({title:'BLOOM FOR YOU — Một món quà 20/10',text:shareText(bloom)});
      notify('Cảm ơn bạn đã gửi một chút dịu dàng!');
    } catch(error) {
      if(error.name!=='AbortError')await copyWish(bloom);
    } finally {button.disabled=false;}
  });
})();
