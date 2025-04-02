import RoomImage from "@model/roomImage.model";

// 🔹 Thêm nhiều ảnh cùng lúc
async function addSomeImages(images: { room_id: number; image_url: string }[]) {
  return await RoomImage.bulkCreate(images);
}

// 🔹 Lấy danh sách ảnh của một phòng
async function findByRoomId(roomId: number) {
  return await RoomImage.findAll({ where: { room_id: roomId } });
}

// 🔹 Xóa tất cả ảnh của một phòng
async function deleteByRoomId(roomId: number) {
  return await RoomImage.destroy({ where: { room_id: roomId } });
}

export default { addSomeImages, findByRoomId, deleteByRoomId };
