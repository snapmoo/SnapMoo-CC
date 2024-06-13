const db = require('../config/firestore');
const express = require('express');
const router = express.Router();
const articles = [
  {
    title: 'Jelang Idul Adha, Kenali Wabah PMK dan Tips Memilih Hewan Kurban yang Sehat',
    link: 'https://www.detik.com/jatim/berita/d-7371262/jelang-idul-adha-kenali-wabah-pmk-dan-tips-memilih-hewan-kurban-yang-sehat',
    date: 'Senin, 03 Juni 2024',
    imageUrl: 'https://akcdn.detik.net.id/community/media/visual/2024/01/24/300-ribu-ekor-ternak-di-blitar-ditarget-dapat-vaksinasi-pmk-kedua_169.jpeg?w=700&q=90',
    publisher: 'Detik.com',
    publisherLogo: 'https://yt3.googleusercontent.com/ytc/AIdro_mEwW7luodJ66Kgh8dOXQIk5OHFLaBvhRY_DErnvMyaIfo=s900-c-k-c0x00ffffff-no-rj'
  },
  {
    title: 'Dinas Peternakan Jatim Ungkap Penyebab Kasus PMK Muncul di Daerah',
    link: 'https://www.detik.com/jatim/berita/d-7228624/dinas-peternakan-jatim-ungkap-penyebab-kasus-pmk-muncul-di-daerah',
    date: 'Rabu, 06 Maret 2024',
    imageUrl: 'https://akcdn.detik.net.id/community/media/visual/2024/02/22/pmk-mengganas-di-kabupaten-pasuruan-sepekan-ratusan-sapi-terjangkit-dan-puluhan-mati_169.jpeg?w=700&q=90',
    publisher: 'Detik.com',
    publisherLogo: 'https://yt3.googleusercontent.com/ytc/AIdro_mEwW7luodJ66Kgh8dOXQIk5OHFLaBvhRY_DErnvMyaIfo=s900-c-k-c0x00ffffff-no-rj'
  },
  {
    title: 'PMK Mulai Mewabah Di Pasuruan, Sepekan 145 Sapi Terjangkit dan 31 Ekor Mati',
    link: 'https://www.detik.com/jatim/berita/d-7205647/pmk-mulai-mewabah-di-pasuruan-sepekan-145-sapi-terjangkit-dan-31-ekor-mati',
    date: 'Kamis, 22 Februari 2024',
    imageUrl: 'https://akcdn.detik.net.id/community/media/visual/2024/02/22/pmk-mengganas-di-kabupaten-pasuruan-sepekan-ratusan-sapi-terjangkit-dan-puluhan-mati_43.jpeg?w=700&q=90',
    publisher: 'Detik.com',
    publisherLogo: 'https://yt3.googleusercontent.com/ytc/AIdro_mEwW7luodJ66Kgh8dOXQIk5OHFLaBvhRY_DErnvMyaIfo=s900-c-k-c0x00ffffff-no-rj'
  },
  {
    title: 'Langkah Pemkab Pasuruan Tangani PMK yang Kembali Mewabah',
    link: 'https://www.detik.com/jatim/berita/d-7206755/langkah-pemkab-pasuruan-tangani-pmk-yang-kembali-mewabah',
    date: 'Kamis, 22 Februari 2024',
    imageUrl: 'https://akcdn.detik.net.id/community/media/visual/2024/02/22/penyemprotan-desinfektan-di-salah-satu-pasar-hewan-di-pasuruan-2_169.jpeg?w=700&q=90',
    publisher: 'Detik.com',
    publisherLogo: 'https://yt3.googleusercontent.com/ytc/AIdro_mEwW7luodJ66Kgh8dOXQIk5OHFLaBvhRY_DErnvMyaIfo=s900-c-k-c0x00ffffff-no-rj'
  },
  {
    title: 'Kasus PMK Kembali Merebak, Diskannak Garut Perketat Pembelian Ternak dari Luar Daerah',
    link: 'https://diskominfo.jabarprov.go.id/berita/kasus-pmk-kembali-merebak-diskannak-garut-perketat-pembelian-ternak-dari-luar-daerah-12341',
    date: 'Sabtu, 10 Februari 2024',
    imageUrl: 'https://dvgddkosknh6r.cloudfront.net/live/media/img/1707552552-IMG-20240210-WA0117.jpg',
    publisher: 'DISKOMINFO JAWA BARAT',
    publisherLogo: 'https://diskominfo.jabarprov.go.id/logo.svg'
  },
  {
    title: 'Kasus PMK Kembali Merebak. Puluhan Sapi Mati. Pj Bupati Andriyanto Minta Peternak Tingkatkan Kewaspadaan',
    link: 'https://www.pasuruankab.go.id/isiberita/kasus-pmk-kembali-merebak-puluhan-sapi-mati-pj-bupati-andriyanto-minta-peternak-tingkatkan-kewaspadaan',
    date: 'Selasa, 20 Februari 2024',
    imageUrl: 'https://www.pasuruankab.go.id/files/berita/202402/10162-65d4a4557621c.jpg',
    publisher: 'Pemerintah Kabupaten Pasuruan',
    publisherLogo: 'https://www.pasuruankab.go.id/assets/landing/images/logo.png'
  },
  {
    title: 'Kasus PMK Kian Menurun di Sejumlah Wilayah di Indonesia',
    link: 'https://ditjenpkh.pertanian.go.id/berita/1551-kasus-pmk-kian-menurun-di-sejumlah-wilayah-di-indonesia',
    date: 'Sabtu, 06 Agustus 2024',
    imageUrl: 'https://ditjenpkh.pertanian.go.id/storage/photos/shares/konten/berita/KasusPMKMenurun.jpg',
    publisher: 'DIREKTORAT JENDERAL PETERNAKAN DAN KESEHATAN HEWAN',
    publisherLogo: 'https://ditjenpkh.pertanian.go.id/assets/frontoffice/static/img/logo.png'
  },
  {
    title: 'Kick Off Vaksinasi PMK Tahun 2023, Jatim Booster 230 Ribu Ekor Sapi Perah',
    link: 'https://ditjenpkh.pertanian.go.id/berita/1624-kick-off-vaksinasi-pmk-tahun-2023-jatim-booster-230-ribu-ekor-sapi-perah',
    date: 'Sabtu, 28 Januari 2023',
    imageUrl: 'https://ditjenpkh.pertanian.go.id/storage/photos/shares/konten/berita/KickOffJatim.jpeg',
    publisher: 'DIREKTORAT JENDERAL PETERNAKAN DAN KESEHATAN HEWAN',
    publisherLogo: 'https://ditjenpkh.pertanian.go.id/assets/frontoffice/static/img/logo.png'
  },
  {
    title: 'PMK: Peternak sapi sebut situasinya sudah \'SOS\' karena penularan \'memburuk\' jelang Iduladha, pemerintah didesak tetapkan status wabah nasional',
    link: 'https://www.bbc.com/indonesia/indonesia-61701746',
    date: 'Rabu, 8 Juni 2022',
    imageUrl: 'https://ichef.bbci.co.uk/ace/ws/800/cpsprodpb/993D/production/_125292293_antarafoto-pengobatan-sapi-terjangkit-pmk-di-aceh-210522-irp-1.jpg.webp',
    publisher: 'BBC NEWS INDONESIA',
    publisherLogo: 'https://e7.pngegg.com/pngimages/850/1001/png-clipart-computer-icons-logo-of-the-bbc-bbc-world-news-uc-browser-text-rectangle.png'
  }
];

async function uploadArticles() {
  const batch = db.batch();
  articles.forEach((article) => {
    const articleRef = db.collection('articles').doc(); // Generate unique document ID
    batch.set(articleRef, article);
  });

  await batch.commit();
  console.log('Articles uploaded successfully!');
}

uploadArticles().catch(console.error);
