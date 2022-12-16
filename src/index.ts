  import axios from "axios";
import cheerio from "cheerio";
import { createObjectCsvWriter } from "csv-writer"


const url = "https://gippo-market.by/catalog/molochnye-produkty-yaytso-isg22/syr-isg262/";

const AxiosInstance = axios.create();
const csvWriter = createObjectCsvWriter({
    path: "./output.csv",
    header: [
        {id: "title", title: "Title"},
        {id: "price", title: "Price"},
        {id: "type", title: "Type"},
    ]
})

interface prodData {
  title: string;
  price: string;
  type: string;
}

AxiosInstance.get(url)
  .then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);
    const rankingsTableRows = $(" .ajax-nav-item-row > .slider-catalog");

    const rankings: prodData[] = [];

    rankingsTableRows.each((i, elem) => {
      const title: string = $(elem)
        .find(".swiper   > .swiper-container > .swiper-wrapper > .swiper-slide > .product-card > .product-card__container > .product-card__body > .product-card__descr-wrap > .title-wrap > a")
        .text()
        .replace(/(\r\n|\n|\r)/gm, "")
        .trim();

      const price: string = $(elem)
      .find(".swiper  > .swiper-container > .swiper-wrapper > .swiper-slide  > .product-card > .product-card__container > .product-card__body > .product-card__footer > .product-card__price-wrap > .price-container > .price")
      .text()
      .replace(/(\r\n|\n|\r)/gm, "")
      .trim();
      const type: string = "сыр"
      rankings.push({
        title,
        price,
        type 
      });
    });


    csvWriter.writeRecords(rankings).then(() => console.log("Written to file"))
  })
  .catch(console.error);