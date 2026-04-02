# Toplu Taşıma Takip Sistemi - Frontend

Next.js ile geliştirilmiş modern ve kullanıcı dostu toplu taşıma takip sistemi frontend uygulaması.

## Özellikler

- ✅ **Hat Yönetimi**: Hat oluşturma, silme ve durakları hatlara ekleme
- ✅ **Durak Yönetimi**: Durak oluşturma, silme ve koordinat bilgisi ekleme
- ✅ **Araç Takibi**: Araç oluşturma, hat atama, sefer başlatma ve gerçek zamanlı takip
- ✅ **Varış Süresi Tahmini**: Aktif seferler için ETA (Estimated Time of Arrival) gösterimi
- ✅ **İstatistikler**: Hat bazlı sefer, bilet ve gelir istatistikleri ile görsel grafikler
- ✅ **Gerçek Zamanlı Güncelleme**: Aktif seferler ve ETA bilgileri otomatik güncellenir

## Teknolojiler

- **Next.js 14** - React framework
- **TypeScript** - Tip güvenliği
- **Tailwind CSS** - Modern UI tasarımı
- **TanStack Query (React Query)** - Veri yönetimi ve caching
- **Axios** - HTTP istekleri
- **Recharts** - Grafik ve görselleştirme
- **Lucide React** - İkonlar

## Kurulum

1. Bağımlılıkları yükleyin:

```bash
npm install
```

2. Backend uygulamanızın çalıştığından emin olun (varsayılan: `http://localhost:8080`)

3. Development server'ı başlatın:

```bash
npm run dev
```

4. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın

## Yapı

```
frontend/
├── app/                    # Next.js App Router sayfaları
│   ├── page.tsx           # Dashboard
│   ├── routes/            # Hat yönetimi
│   ├── stops/             # Durak yönetimi
│   ├── vehicles/          # Araç takibi
│   └── stats/             # İstatistikler
├── components/            # React bileşenleri
│   ├── Navbar.tsx         # Navigasyon menüsü
│   └── EtaDisplay.tsx     # ETA gösterim bileşeni
├── lib/                   # Yardımcı fonksiyonlar
│   └── api.ts             # API client
└── types/                 # TypeScript tip tanımlamaları
    └── index.ts
```

## API Endpoints

Frontend, Spring Boot backend'inizdeki şu endpoint'leri kullanır:

- `GET /api/routes` - Tüm hatlar
- `POST /api/routes` - Yeni hat oluştur
- `GET /api/routes/{id}` - Hat detayı
- `DELETE /api/routes/{id}` - Hat sil
- `POST /api/routes/{routeId}/stops` - Hat'a durak ekle
- `GET /api/routes/{routeId}/stops` - Hat durakları
- `GET /api/stops` - Tüm duraklar
- `POST /api/stops` - Yeni durak oluştur
- `DELETE /api/stops/{id}` - Durak sil
- `GET /api/vehicles` - Tüm araçlar
- `POST /api/vehicles` - Yeni araç oluştur
- `PUT /api/vehicles/{vehicleId}/route/{routeId}` - Aracı hata bağla
- `POST /api/trips/start` - Sefer başlat
- `GET /api/trips/active` - Aktif seferler
- `PUT /api/trips/{tripId}/next-stop` - Sonraki durağa geç
- `GET /api/trips/{tripId}/eta` - Varış süresi tahmini
- `GET /api/stats/route/{routeId}` - Hat istatistikleri

## CORS Ayarları

Backend'inizde CORS ayarlarının yapıldığından emin olun. Spring Boot için örnek yapılandırma:

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedHeaders("*");
            }
        };
    }
}
```

## Kullanım

### Hat Yönetimi
1. "Hatlar" sayfasına gidin
2. "Yeni Hat" butonuna tıklayarak yeni hat oluşturun
3. Hat kartında "Durak Ekle" butonuna tıklayarak durakları hatlara ekleyin

### Durak Yönetimi
1. "Duraklar" sayfasına gidin
2. "Yeni Durak" butonuna tıklayarak yeni durak oluşturun
3. İsteğe bağlı olarak koordinat bilgisi ekleyin

### Araç Takibi
1. "Araç Takibi" sayfasına gidin
2. "Yeni Araç" butonuna tıklayarak yeni araç oluşturun
3. Araç kartında "Hat Ata" butonuna tıklayarak aracı bir hata bağlayın
4. "Sefer Başlat" butonuna tıklayarak seferi başlatın
5. "Sonraki Durak" butonuna tıklayarak aracı bir sonraki durağa taşıyın
6. ETA bilgisi otomatik olarak güncellenir

### İstatistikler
1. "İstatistikler" sayfasına gidin
2. Bir hat seçerek o hat için detaylı istatistikleri görüntüleyin
3. Grafiklerde hat bazlı sefer sayıları ve araç tipi dağılımını görüntüleyin

## Production Build

```bash
npm run build
npm start
```

## Lisans

Bu proje eğitim amaçlı geliştirilmiştir.











