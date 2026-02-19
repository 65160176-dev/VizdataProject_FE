# เปลี่ยนจาก node:18-alpine เป็น node:18 เฉยๆ (ตัวเต็ม มีเครื่องมือครบกว่า)
FROM node:18 as build-stage

WORKDIR /app

# Copy แค่ package.json มาก่อน (ยังไม่เอา lock file มา เพื่อให้มันสร้างใหม่เองสำหรับ Linux)
COPY package.json ./

# สั่งลงโปรแกรม (เพิ่ม --legacy-peer-deps เผื่อ version ตีกัน)
RUN npm install --legacy-peer-deps

# ค่อย Copy โค้ดที่เหลือ
COPY . .

# สั่ง Build
RUN npm run build

# --- ส่วนของการรัน Web Server (เหมือนเดิม) ---
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]