const fp = new Intl.NumberFormat("vi-VN", {
  style: "decimal",
});

const formatPrice = (price: number) => {
  return `${fp.format(price)} đ`;
};

export { formatPrice };
