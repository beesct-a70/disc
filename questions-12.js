const QUESTIONS_12 = [
  {
    id: 1,
    title: 'Câu 1 – Khi bắt đầu một dự án mới, bạn thường:',
    items: [
      { trait: 'D', text: 'Nhanh chóng xác định mục tiêu và bắt tay làm ngay.' },
      { trait: 'I', text: 'Hào hứng chia sẻ ý tưởng với mọi người xung quanh.' },
      { trait: 'S', text: 'Quan sát và tìm hiểu kỹ trước khi tham gia sâu.' },
      { trait: 'C', text: 'Thu thập đủ thông tin rồi mới hành động.' }
    ]
  },
  {
    id: 2,
    title: 'Câu 2 – Khi có vấn đề xảy ra, bạn thường:',
    items: [
      { trait: 'D', text: 'Chủ động đứng ra giải quyết ngay.' },
      { trait: 'I', text: 'Trấn an tinh thần mọi người trước.' },
      { trait: 'S', text: 'Giữ bình tĩnh và tìm cách dung hòa.' },
      { trait: 'C', text: 'Phân tích nguyên nhân thật kỹ.' }
    ]
  },
  {
    id: 3,
    title: 'Câu 3 – Trong một cuộc họp, bạn thường:',
    items: [
      { trait: 'D', text: 'Đi thẳng vào trọng tâm và chốt phương án.' },
      { trait: 'I', text: 'Tạo không khí thoải mái để mọi người dễ trao đổi.' },
      { trait: 'S', text: 'Lắng nghe nhiều hơn nói.' },
      { trait: 'C', text: 'Ghi chú và kiểm tra lại các chi tiết quan trọng.' }
    ]
  },
  {
    id: 4,
    title: 'Câu 4 – Khi làm việc nhóm, bạn thích:',
    items: [
      { trait: 'D', text: 'Được giao trách nhiệm rõ ràng và quyền quyết định.' },
      { trait: 'I', text: 'Được tương tác và trao đổi liên tục.' },
      { trait: 'S', text: 'Làm việc trong môi trường ổn định, ít xáo trộn.' },
      { trait: 'C', text: 'Làm theo kế hoạch và tiêu chuẩn cụ thể.' }
    ]
  },
  {
    id: 5,
    title: 'Câu 5 – Khi đối mặt với thay đổi lớn, bạn:',
    items: [
      { trait: 'D', text: 'Xem đó là cơ hội để bứt phá.' },
      { trait: 'I', text: 'Hào hứng thử điều mới cùng người khác.' },
      { trait: 'S', text: 'Cần thời gian để thích nghi dần.' },
      { trait: 'C', text: 'Muốn hiểu rõ rủi ro trước khi chấp nhận.' }
    ]
  },
  {
    id: 6,
    title: 'Câu 6 – Khi thuyết phục người khác, bạn thường:',
    items: [
      { trait: 'D', text: 'Nêu rõ mục tiêu và lợi ích đạt được.' },
      { trait: 'I', text: 'Truyền cảm hứng bằng năng lượng tích cực.' },
      { trait: 'S', text: 'Tạo cảm giác an tâm và tin tưởng.' },
      { trait: 'C', text: 'Đưa ra dữ liệu và dẫn chứng cụ thể.' }
    ]
  },
  {
    id: 7,
    title: 'Câu 7 – Điều khiến bạn khó chịu nhất là:',
    items: [
      { trait: 'D', text: 'Sự chậm trễ và thiếu quyết đoán.' },
      { trait: 'I', text: 'Không khí quá căng thẳng, thiếu tương tác.' },
      { trait: 'S', text: 'Xung đột và tranh cãi gay gắt.' },
      { trait: 'C', text: 'Sự cẩu thả và thiếu logic.' }
    ]
  },
  {
    id: 8,
    title: 'Câu 8 – Bạn được người khác nhận xét là:',
    items: [
      { trait: 'D', text: 'Mạnh mẽ và quyết liệt.' },
      { trait: 'I', text: 'Nhiệt tình và dễ gần.' },
      { trait: 'S', text: 'Điềm đạm và đáng tin.' },
      { trait: 'C', text: 'Cẩn trọng và kỹ tính.' }
    ]
  },
  {
    id: 9,
    title: 'Câu 9 – Khi đặt mục tiêu, bạn:',
    items: [
      { trait: 'D', text: 'Muốn đạt kết quả càng nhanh càng tốt.' },
      { trait: 'I', text: 'Muốn cùng mọi người chinh phục mục tiêu.' },
      { trait: 'S', text: 'Muốn tiến từng bước chắc chắn.' },
      { trait: 'C', text: 'Muốn đảm bảo mọi chi tiết đều chính xác.' }
    ]
  },
  {
    id: 10,
    title: 'Câu 10 – Trong môi trường mới, bạn:',
    items: [
      { trait: 'D', text: 'Nhanh chóng tìm cơ hội để thể hiện năng lực.' },
      { trait: 'I', text: 'Chủ động bắt chuyện và làm quen.' },
      { trait: 'S', text: 'Quan sát trước khi tham gia sâu.' },
      { trait: 'C', text: 'Tìm hiểu quy định và cách vận hành trước.' }
    ]
  },
  {
    id: 11,
    title: 'Câu 11 – Khi phải ra quyết định quan trọng, bạn:',
    items: [
      { trait: 'D', text: 'Tin vào trực giác và hành động nhanh.' },
      { trait: 'I', text: 'Tham khảo ý kiến và tạo sự đồng thuận.' },
      { trait: 'S', text: 'Cân nhắc ảnh hưởng đến mọi người.' },
      { trait: 'C', text: 'Phân tích kỹ ưu – nhược điểm.' }
    ]
  },
  {
    id: 12,
    title: 'Câu 12 – Bạn cảm thấy mình phát huy tốt nhất khi:',
    items: [
      { trait: 'D', text: 'Được trao quyền và thử thách lớn.' },
      { trait: 'I', text: 'Được giao tiếp và truyền động lực.' },
      { trait: 'S', text: 'Được làm việc trong môi trường ổn định.' },
      { trait: 'C', text: 'Được làm việc có cấu trúc rõ ràng.' }
    ]
  }
];
