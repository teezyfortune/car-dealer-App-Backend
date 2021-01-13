export default{
    createProduct: 'INSERT INTO product(id, vehicle_type, product_name, image_url, vehicle_history, manufactured_date) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
    getProductById: 'SELECT * FROM product WHERE id=$1',
    updateProduct: 'UPDATE product SET product_type=$1, product_name=$2, image_url=$3, updated_at=NOW() WHERE id=$4 RETURNING *',
    getAllProduct: 'SELECT * FROM product ORDER BY created_at LIMIT $1 OFFSET $2',
    getProductByName:'SELECT * FROM product WHERE product_name =$1'
}