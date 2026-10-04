# Carousel Design Principles

Hướng dẫn thiết kế carousel dài (50-100+ slides) cho Facebook Photo Album.

## Format Specs

- **Dimensions**: 1080x1080px (1:1 ratio)
- **Safe zone**: 80px từ mép (tránh bị crop trên mobile)
- **Export**: PNG hoặc JPG quality 90%+

## Flow & Pacing (Nhịp điệu)

### Cấu trúc tổng thể

| Phần | Slides | Mục đích |
|------|--------|----------|
| Hook | 1-3 | Gây tò mò, câu view |
| Setup | 4-10 | Giới thiệu vấn đề/context |
| Body | 11-70 | Nội dung chính |
| Climax | 71-75 | Điểm nhấn quan trọng nhất |
| Outro | 76-80 | Recap + CTA |

### Rest Slides (Visual Breaks)

Mỗi 10-15 slides, chèn 1 "rest slide":
- Quote slide với typography đẹp
- Full-color slide (chỉ màu, không text)
- Icon/illustration slide
- Số liệu lớn (big number)

**Mục đích**: Cho mắt nghỉ, tạo rhythm, ngăn fatigue.

## Typography

### Font Pairing Gợi ý

| Heading | Body | Vibe |
|---------|------|------|
| Montserrat Bold | Inter Regular | Clean, modern |
| Playfair Display | Lato | Elegant, editorial |
| Bebas Neue | Open Sans | Bold, energetic |
| Lora | Source Sans Pro | Warm, readable |

### Size Scale (1080x1080)

| Element | Size | Line Height |
|---------|------|-------------|
| Big Title | 72-96px | 1.1 |
| Title | 48-64px | 1.2 |
| Subtitle | 36-42px | 1.3 |
| Body | 28-36px | 1.4 |
| Caption | 20-24px | 1.4 |

### Rules

- **Max 30-40 từ/slide** (đọc trong 5-8 giây)
- **1-2 ideas/slide** - không nhồi nhét
- **Avoid justified text** - dùng left-align hoặc center

## Color

### Palette Structure

```
Primary    → Màu chủ đạo (headings, key elements)
Secondary  → Màu phụ (accents, highlights)
Neutral    → Backgrounds, body text
Alert      → CTAs, important callouts
```

### Contrast Rules

- Text trên background: contrast ratio ≥ 4.5:1
- Large text (>24px bold): ratio ≥ 3:1
- Tool check: WebAIM Contrast Checker

### Color Psychology (Vietnamese audience)

| Màu | Cảm xúc | Dùng cho |
|-----|---------|----------|
| Đỏ | Năng lượng, may mắn | CTA, highlights |
| Xanh dương | Tin cậy, chuyên nghiệp | Business, tech |
| Xanh lá | Tăng trưởng, tự nhiên | Health, finance |
| Vàng/Cam | Vui vẻ, sáng tạo | Entertainment |
| Tím | Sang trọng, bí ẩn | Premium content |
| Đen/Trắng | Minimalist, cao cấp | Editorial, luxury |

## Layout Patterns

### Các layout hay dùng

1. **Center Focus**
   - Text căn giữa
   - Tốt cho quotes, big statements

2. **Top-Heavy**
   - Title lớn ở trên
   - Supporting content ở dưới

3. **Split (50/50)**
   - Trái: visual/icon
   - Phải: text
   - Hoặc ngược lại

4. **Card Style**
   - Content trong "card" có shadow/border
   - Background khác màu

5. **Full Bleed Image**
   - Ảnh full slide
   - Text overlay với semi-transparent background

### Grid System

- Dùng grid 3x3 hoặc 4x4
- Align elements theo grid lines
- Consistent margins: 60-80px

## Visual Hierarchy

### Tạo hierarchy bằng:

1. **Size** - Quan trọng = to hơn
2. **Weight** - Bold cho emphasis
3. **Color** - Màu nổi bật cho key points
4. **Position** - Top/center = quan trọng
5. **Whitespace** - Càng nhiều space xung quanh = càng quan trọng

### The Squint Test

Nheo mắt nhìn slide → vẫn thấy được hierarchy không?

## Engagement Techniques

### Hook Slides (Slide 1-3)

- Câu hỏi gây tò mò: "Bạn có biết...?"
- Số liệu shocking: "97% người Việt..."
- Contradiction: "Điều bạn tin là sai"
- Promise: "Sau 80 slides này, bạn sẽ..."

### Interactive Elements

- "Swipe để xem tiếp →"
- "Save lại để đọc sau"
- Numbering: "15/80" tạo sense of progress
- Cliffhangers giữa slides

### CTA Slides (Cuối)

- Follow để xem thêm
- Share nếu thấy hay
- Comment ý kiến của bạn
- Tag người cần đọc

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Quá nhiều text | Max 40 từ/slide |
| Font quá nhỏ | Min 28px cho body |
| Thiếu contrast | Check với contrast tool |
| Inconsistent style | Dùng template system |
| Không có visual break | Rest slide mỗi 10-15 slides |
| Hook yếu | 3 slides đầu phải gây tò mò |
| Không có CTA | Luôn có slide cuối với action |

## Checklist Trước Khi Đăng

- [ ] Hook đủ mạnh? (slide 1-3)
- [ ] Có rest slides không? (mỗi 10-15 slides)
- [ ] Font đủ lớn cho mobile?
- [ ] Contrast đủ cao?
- [ ] Consistent style xuyên suốt?
- [ ] Có CTA ở cuối?
- [ ] Đã test trên mobile?
