# Decision Log

## Quá trình làm bài

### 1. Review ban đầu
Prompt: "Đọc toàn bộ project, xác định lỗi thật sự, không sửa trước khi có evidence."
AI trả lời: đã phân tích source code và phát hiện các lỗi build blocker như missing router dependency, missing auth/context/service files, duplicate export, import type issue.
Quyết định cuối: chỉ sửa các lỗi build/runtime thực sự vì đây là blocker chính.
Đánh giá: AI đúng ở chỗ phát hiện được các lỗi cần sửa, sai ở chỗ không nêu đủ Docker/doc requirement.

### 2. Verify requirement
Prompt: "Kiểm tra requirement và xác định phần nào đang PASS/PARTIAL/FAIL."
AI trả lời: flow login/list/detail/logout đã có sẵn, nhưng Docker/documents chưa hoàn thiện.
Quyết định cuối: bổ sung Dockerfile, docker-compose, README, APPROACH, DECISION_LOG và hoàn thiện filter theo dữ liệu product.
Đánh giá: AI đúng vì requirement phần Docker và documentation là blocker còn lại.
