import{e as c,v as g,s as i,f as h,d as p}from"./auth-5AvIqP9D.js";const s=document.getElementById("reset-password-form"),e=document.getElementById("reset-button"),o=document.getElementById("token"),v=new URLSearchParams(window.location.search),t=v.get("token");o&&t?o.value=t:t||(window.location.href="/forgot-password.html");s&&s.addEventListener("submit",async w=>{var a,d;w.preventDefault();const l=o.value,r=document.getElementById("password").value,m=document.getElementById("password-confirm").value;c("error-message"),c("success-message");const n=g(r,m);if(n){i(n);return}e.disabled=!0,e.textContent="Resetting...";try{await h.resetPassword(l,r),p("Password reset successful. You can now login with your new password."),s.reset(),setTimeout(()=>{window.location.href="/login.html"},3e3)}catch(u){const f=((d=(a=u.response)==null?void 0:a.data)==null?void 0:d.error)||"Password reset failed";i(f),e.disabled=!1,e.textContent="Reset Password"}});
