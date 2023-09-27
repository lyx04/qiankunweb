import { Rect } from "@topology/core";
export function myShape(ctx, node) {
  // 必须判空再填充
  ctx.beginPath();
  ctx.strokeStyle = "#ffffff";
  ctx.strokeRect(node.rect.x, node.rect.y, node.rect.width, node.rect.height);
  (node.fillStyle || node.bkType) && ctx.fill();
  // ctx.lineTo(node.rect.x + node.rect.width / 4, node.rect.y);
  // ctx.lineTo(node.rect.x, node.rect.y);
  // ctx.lineTo(node.rect.x, node.rect.y + node.rect.height);
  // ctx.lineTo(node.rect.x + node.rect.width, node.rect.y + node.rect.height);
  // ctx.lineTo(node.rect.x + node.rect.width, node.rect.y);
  // ctx.lineTo(
  //   node.rect.x + (node.rect.width - node.rect.width / 4),
  //   node.rect.y
  // );
  ctx.stroke();
}

export function myTextRect(node) {
  node.fullTextRect = new Rect(
    node.rect.x,
    node.rect.y - 30,
    node.rect.width,
    30
  );
}
