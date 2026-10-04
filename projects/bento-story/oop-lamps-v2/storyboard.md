# OOP v2 — composition-led rebuild

Controlled comparison: same 15 voice clips, words, timings and Python example as v1. New native renderer; no ImageGen. Handmade original SVG lamp geometry, one consistent stroke/fill family. Fonts retain bundled licenses.

Source treatments: think1/01 poster, think1/06 internal split, think2/15 asymmetric anchor, think4/37 ownership inset, think5/49 tall comparison, think6/64 typographic rule. Spatial composition is adapted; motion is newly authored.

| Shot / phase | Spoken anchor | Before | Model action / after |
|---|---|---|---|
| intro / question | Hai chiếc đèn; đèn còn lại | One poster | Two native lamp icons enter, question routes between them; answer withheld |
| 1 / setup | có trạng thái; dữ liệu | familiar lamp | Lamp becomes a specimen closeup; state field opens beside it |
| 2 / setup | hành vi; phương thức | state visible | Method compartment enters; state moves to make space in the owning object |
| 3 / decode | Gom dữ liệu; một đối tượng | related compartments | Compartments converge; enclosing object boundary and label join them |
| 4 / decode | một lớp; bản thiết kế | conceptual object | Object leaves; class specification expands as a distinct blue panel, not a live instance |
| 5 / decode | mỗi đèn mới; ban đầu là sai | class specification | Constructor opens; False token enters the default field, labeled initial state |
| 6 / decode | Phương thức bật; Từ self | specification | Method detail takes main area; self links to receiver placeholder; definition only, no live state commit |
| 7 / execute | tạo một đối tượng; đèn bàn | class above | First instance emerges from a creation path and settles with own False field |
| 8 / execute | Tạo tiếp; đèn ngủ | first instance | Second creation path builds bed; both objects remain separately enclosed |
| 9 / execute | Phần trước; phần sau | two instances | Invocation enlarged; receiver segment connects to desk, method segment targets its method |
| 10 / execute | self ở đây; chuyển thành đúng | desk selected | Receiver opens in detail; method-to-field path runs; field becomes True and lamp lights at commit |
| 11 / verify | đèn ngủ; không nhận lời gọi | changed desk | Bed grows into inspection view; field stays False and no-call indicator is attached to its method |
| 12 / verify | dùng chung; trạng thái riêng | inspection | Equal comparison panels reassemble beneath shared class specification; fields align |
| 13 / verify | chứa dữ liệu; gọi hành vi | pair | Open desk into state/method compartments again; trace relationship without rerunning state change |
| outro / rule | dữ liệu cùng hành vi; Lớp mô tả | worked result | Poster combines state + method; class-to-instance strip appears; observed states remain as witnesses |

Important: familiar lamp and conceptual object in setup are diagrams of the concept, not the later Python instances. Python objects only appear during execute. Shared method panels express availability, not separate Python method code allocations. The fixed-order script schema remains for narration; its events are empty because custom native cues are implemented in story-engine.js. Use custom-operation samples and actual frames; the stock audit cannot measure these DOM/SVG operations.
