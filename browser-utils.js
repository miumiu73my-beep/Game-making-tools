(function(){
"use strict";
const encoder=new TextEncoder();
function safeName(v){return String(v||"file").replace(/[\/\\:*?"<>|\u0000-\u001f]/g,"_").trim()||"file";}
function bytesFromBase64(text){const raw=atob(text);const out=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)out[i]=raw.charCodeAt(i);return out;}
function saveLink(container,filename,data,type){
 const blob=data instanceof Blob?data:new Blob([data],{type:type||"application/octet-stream"});
 const link=document.createElement("a");link.textContent="保存: "+filename;link.download=safeName(filename);link.href=URL.createObjectURL(blob);link.className="download";container.appendChild(link);return link;
}
function crc32(bytes){let c=0xffffffff;for(const b of bytes){c^=b;for(let k=0;k<8;k++)c=(c>>>1)^(c&1?0xedb88320:0);}return(c^0xffffffff)>>>0;}
function zip(items){
 const chunks=[],central=[];let offset=0;
 const u16=n=>new Uint8Array([n&255,(n>>>8)&255]),u32=n=>new Uint8Array([n&255,(n>>>8)&255,(n>>>16)&255,(n>>>24)&255]);
 const join=parts=>{const size=parts.reduce((a,v)=>a+v.length,0),b=new Uint8Array(size);let o=0;for(const v of parts){b.set(v,o);o+=v.length;}return b;};
 for(const item of items){
  const name=encoder.encode(safeName(item.name));
  const data=item.data instanceof Uint8Array?item.data:encoder.encode(String(item.data));
  const size=data.length,checksum=crc32(data);
  const local=join([u32(0x04034b50),u16(20),u16(0x0800),u16(0),u16(0),u16(0),u32(checksum),u32(size),u32(size),u16(name.length),u16(0),name,data]);
  const directory=join([u32(0x02014b50),u16(20),u16(20),u16(0x0800),u16(0),u16(0),u16(0),u32(checksum),u32(size),u32(size),u16(name.length),u16(0),u16(0),u16(0),u16(0),u32(0),u32(offset),name]);
  chunks.push(local);central.push(directory);offset+=local.length;
 }
 const directory=join(central),end=join([u32(0x06054b50),u16(0),u16(0),u16(items.length),u16(items.length),u32(directory.length),u32(offset),u16(0)]);
 return new Blob([...chunks,directory,end],{type:"application/zip"});
}
window.PWAUtils={safeName,saveLink,zip,bytesFromBase64,encoder};
})();