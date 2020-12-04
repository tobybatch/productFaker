const faker = require('faker');
const ObjectsToCsv = require('objects-to-csv')

const FILENAME = "out.csv";

const ROW_COUNT = 500;

const SALE_PRICE_CHANCE = 0.80;
const SALE_DISCOUNT = 0.80;

const SUB_CATEGORY_CHANCE = 0.1;
const SUB_CATEGORY_MAX_DEPTH = 3;

const ANOTHER_IMAGE_CHANCE = 0.3;
const ANOTHER_IMAGE_MAX_DEPTH = 3;

const SIZES = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];

/* ************************************** */
const hasSalePrice = Math.random() > SALE_PRICE_CHANCE;

const rows = [];
let row = [];

let currentSku = 0;

const skuGroupCount = Math.floor((Math.random() * 5));
let skuGroups = [];
for (let i = 0; i < skuGroupCount; i++) {
	skuGroups.push(nextSku());
}

for (let i = 0; i < ROW_COUNT; i++) {
	row = [];
	row["sku_code"] = nextSku();
	row["group_sku"] = skuGroups[Math.max(1, Math.floor(Math.random() * skuGroups.length - 1))];
	row["title"] = faker.commerce.productName();
	row["description"] = faker.lorem.paragraph();
	row["price"] = faker.commerce.price(20, 200);
	row["normal_price"] = hasSalePrice ? row["price"] : undefined;;
	row["sale_price"] = hasSalePrice ? row['price'] * SALE_DISCOUNT : undefined;
	row["stock_quantity"] = 10 + Math.floor((Math.random() * 50));
	row["url"] = faker.internet.url();
	row["categories"] = createCategory();
	row["image_URL"] = createImages();
	row["size"] = createSizes();
	row["color"] = faker.commerce.color();
	row["barcode"] = Math.floor((Math.random() * 1000000000)).toString();

	rows.push(row);
}

const csv = new ObjectsToCsv(rows);
// csv.toString().then(data => console.log(data));
csv.toDisk(FILENAME);

//////////////////////////////////////////////////////////////////

function nextSku() {
	currentSku++;
	return "SKU" + currentSku.toString().padStart(5, "0");
}

function createCategory(depth = 0) {
	let catagories = [faker.commerce.department()];
	if (Math.random() > SUB_CATEGORY_CHANCE && depth < SUB_CATEGORY_MAX_DEPTH) {
		catagories.push(createCategory(depth + 1));
	}
	return catagories.join(" > ");
}

function createImages(depth = 0) {
	let image = faker.internet.url();
	if (Math.random() > ANOTHER_IMAGE_CHANCE && depth < ANOTHER_IMAGE_MAX_DEPTH) {
		image += "|" + createCategory(depth + 1)
	}
	return image;
}

function createSizes() {
	const startIndex = Math.floor(Math.random() * SIZES.length * 0.9);
	const endIndex = SIZES.length - Math.floor(Math.random() * SIZES.length * 0.1);
	if (startIndex < endIndex) {
		return SIZES.slice(startIndex, endIndex).join("|");
	}
	return undefined;
}
