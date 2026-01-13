import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CatalogueService } from '../catalogue/catalogue.service';

interface OldCategoryData {
  CategoryId: string;
  CategoryName: string;
  CustomURL: string;
  ShortDescription: string;
  Image: string;
  Banner: string | null;
  DisplayOrder: string;
  MetaTitle: string;
  MetaKeywords: string;
  MetaDescription: string;
  IsActive: string;
  AddedBy: string;
  AddedDate: string;
  UpdatedBy: string;
  UpdatedDate: string;
}

const oldCategoriesData: OldCategoryData[] = [
  {
    "CategoryId": "1",
    "CategoryName": "Arm Chairs",
    "CustomURL": "arm-chairs",
    "ShortDescription": "Arm Chairs",
    "Image": "c_2d725b2f-00be-4441-a232-011e9ac68417.jpg",
    "Banner": null,
    "DisplayOrder": "1",
    "MetaTitle": "Arm Chairs",
    "MetaKeywords": "Arm Chairs",
    "MetaDescription": "Arm Chairs",
    "IsActive": "1",
    "AddedBy": "1",
    "AddedDate": "2023-02-21 18:37:32.573",
    "UpdatedBy": "1",
    "UpdatedDate": "2025-12-03 12:38:13.890"
  },
  {
    "CategoryId": "7",
    "CategoryName": "Bar Cabinets",
    "CustomURL": "bar-cabinets",
    "ShortDescription": "Bar Cabinets",
    "Image": "c_5a0dd3ad-eb42-436e-b163-3f5747425842.jpg",
    "Banner": null,
    "DisplayOrder": "2",
    "MetaTitle": "Bar Cabinets",
    "MetaKeywords": "Bar Cabinets",
    "MetaDescription": "Bar Cabinets",
    "IsActive": "1",
    "AddedBy": "1",
    "AddedDate": "2023-09-01 16:16:52.647",
    "UpdatedBy": "1",
    "UpdatedDate": "2025-12-03 12:20:55.517"
  },
  {
    "CategoryId": "8",
    "CategoryName": "Beds",
    "CustomURL": "beds",
    "ShortDescription": "Beds",
    "Image": "c_13a92438-5397-4aa5-aab0-7442242a7d1d.jpg",
    "Banner": null,
    "DisplayOrder": "3",
    "MetaTitle": "Beds",
    "MetaKeywords": "Beds",
    "MetaDescription": "Beds",
    "IsActive": "1",
    "AddedBy": "1",
    "AddedDate": "2023-09-01 16:26:37.100",
    "UpdatedBy": "1",
    "UpdatedDate": "2025-12-03 14:49:34.503"
  },
  {
    "CategoryId": "10",
    "CategoryName": "Chaise",
    "CustomURL": "chaise",
    "ShortDescription": "Chaise",
    "Image": "c_688abe0a-85eb-4334-9d38-dc3d1eb6e4c2.jpg",
    "Banner": null,
    "DisplayOrder": "4",
    "MetaTitle": "Chaise",
    "MetaKeywords": "Chaise",
    "MetaDescription": "Chaise",
    "IsActive": "1",
    "AddedBy": "1",
    "AddedDate": "2023-09-01 19:23:09.003",
    "UpdatedBy": "1",
    "UpdatedDate": "2025-12-03 14:22:03.953"
  },
  {
    "CategoryId": "11",
    "CategoryName": "Chest Of Drawers",
    "CustomURL": "chest-of-drawers",
    "ShortDescription": "Chest Of Drawers",
    "Image": "c_70dd4f72-177e-4bc2-8ee7-fd6259b91fba.jpg",
    "Banner": null,
    "DisplayOrder": "5",
    "MetaTitle": "Chest Of Drawers",
    "MetaKeywords": "Chest Of Drawers",
    "MetaDescription": "Chest Of Drawers",
    "IsActive": "1",
    "AddedBy": "1",
    "AddedDate": "2023-09-01 19:39:58.773",
    "UpdatedBy": "1",
    "UpdatedDate": "2025-12-03 14:22:54.780"
  },
  {
    "CategoryId": "3",
    "CategoryName": "Coffee Tables",
    "CustomURL": "coffee-tables",
    "ShortDescription": "Coffee Tables",
    "Image": "c_6edcecbf-8388-4227-a24b-5e62945cb09e.jpg",
    "Banner": "b_66369864-c40e-44bb-9f9a-b171abdd1e7f.jpg",
    "DisplayOrder": "6",
    "MetaTitle": "Coffee Tables",
    "MetaKeywords": "Coffee Tables",
    "MetaDescription": "Coffee Tables",
    "IsActive": "1",
    "AddedBy": "1",
    "AddedDate": "2023-02-27 15:50:54.973",
    "UpdatedBy": "1",
    "UpdatedDate": "2025-12-03 12:29:16.550"
  },
  {
    "CategoryId": "12",
    "CategoryName": "Consoles",
    "CustomURL": "consoles",
    "ShortDescription": "Consoles",
    "Image": "c_7589689c-1061-4da7-8ac4-57b2e2c75554.jpg",
    "Banner": null,
    "DisplayOrder": "7",
    "MetaTitle": "Consoles",
    "MetaKeywords": "Consoles",
    "MetaDescription": "Consoles",
    "IsActive": "1",
    "AddedBy": "1",
    "AddedDate": "2023-09-01 19:45:54.167",
    "UpdatedBy": "1",
    "UpdatedDate": "2025-12-03 15:29:28.690"
  },
  {
    "CategoryId": "6",
    "CategoryName": "Dining Chairs",
    "CustomURL": "dining-chairs",
    "ShortDescription": "Dining Chairs",
    "Image": "c_2d2529cd-6706-40f0-9619-db49fbb23ce8.jpg",
    "Banner": "b_a6e73bf3-c253-42ca-bf53-65ae74bebd83.jpg",
    "DisplayOrder": "8",
    "MetaTitle": "Dining Chairs",
    "MetaKeywords": "Dining Chairs",
    "MetaDescription": "Dining Chairs",
    "IsActive": "1",
    "AddedBy": "1",
    "AddedDate": "2023-02-27 15:54:16.013",
    "UpdatedBy": "1",
    "UpdatedDate": "2025-12-03 14:48:27.187"
  },
  {
    "CategoryId": "4",
    "CategoryName": "Dining Tables",
    "CustomURL": "dining-tables",
    "ShortDescription": "Dining Tables",
    "Image": "c_a97c3947-dd07-4e32-a7e3-bfe22f353273.jpg",
    "Banner": null,
    "DisplayOrder": "9",
    "MetaTitle": "Dining Tables",
    "MetaKeywords": "Dining Tables",
    "MetaDescription": "Dining Tables",
    "IsActive": "1",
    "AddedBy": "1",
    "AddedDate": "2023-02-27 15:51:52.253",
    "UpdatedBy": "1",
    "UpdatedDate": "2025-12-03 12:17:36.270"
  },
  {
    "CategoryId": "5",
    "CategoryName": "Ottomans",
    "CustomURL": "ottomans",
    "ShortDescription": "Ottomans",
    "Image": "c_b3f76430-3512-43c2-a9b6-a1fac909f09c.jpg",
    "Banner": null,
    "DisplayOrder": "10",
    "MetaTitle": "Ottomans",
    "MetaKeywords": "Ottomans",
    "MetaDescription": "Ottomans",
    "IsActive": "1",
    "AddedBy": "1",
    "AddedDate": "2023-02-27 15:52:17.330",
    "UpdatedBy": "1",
    "UpdatedDate": "2025-12-03 14:23:26.233"
  },
  {
    "CategoryId": "13",
    "CategoryName": "Screens",
    "CustomURL": "screens",
    "ShortDescription": "Screens",
    "Image": "c_80dc29f1-7902-4a1f-a198-e8736bf4f718.jpg",
    "Banner": null,
    "DisplayOrder": "11",
    "MetaTitle": "Screens",
    "MetaKeywords": "Screens",
    "MetaDescription": "Screens",
    "IsActive": "1",
    "AddedBy": "1",
    "AddedDate": "2023-09-01 19:54:00.143",
    "UpdatedBy": "1",
    "UpdatedDate": "2025-12-03 14:27:21.467"
  },
  {
    "CategoryId": "14",
    "CategoryName": "Shelving Units",
    "CustomURL": "shelving-units",
    "ShortDescription": "Shelving Units",
    "Image": "c_421c6cbc-6ac8-4cae-b927-d47a9e635cb2.jpg",
    "Banner": null,
    "DisplayOrder": "12",
    "MetaTitle": "Shelving Units",
    "MetaKeywords": "Shelving Units",
    "MetaDescription": "Shelving Units",
    "IsActive": "1",
    "AddedBy": "1",
    "AddedDate": "2023-09-01 20:25:57.773",
    "UpdatedBy": "1",
    "UpdatedDate": "2025-12-03 15:29:13.030"
  },
  {
    "CategoryId": "15",
    "CategoryName": "Side Boards",
    "CustomURL": "side-boards",
    "ShortDescription": "Side Boards",
    "Image": "c_c5945430-4d15-4280-b48c-f131deb75f62.jpg",
    "Banner": null,
    "DisplayOrder": "13",
    "MetaTitle": "Side Boards",
    "MetaKeywords": "Side Boards",
    "MetaDescription": "Side Boards",
    "IsActive": "1",
    "AddedBy": "1",
    "AddedDate": "2023-09-01 20:32:25.447",
    "UpdatedBy": "1",
    "UpdatedDate": "2025-12-03 14:22:40.117"
  },
  {
    "CategoryId": "16",
    "CategoryName": "Side Tables",
    "CustomURL": "side-tables",
    "ShortDescription": "Side Tables",
    "Image": "c_59178888-ae3b-40ea-873e-c5f70bf45d93.jpg",
    "Banner": null,
    "DisplayOrder": "14",
    "MetaTitle": "Side Tables",
    "MetaKeywords": "Side Tables",
    "MetaDescription": "Side Tables",
    "IsActive": "1",
    "AddedBy": "1",
    "AddedDate": "2023-09-01 20:38:03.930",
    "UpdatedBy": "1",
    "UpdatedDate": "2025-12-03 11:21:29.817"
  },
  {
    "CategoryId": "2",
    "CategoryName": "Sofas",
    "CustomURL": "sofas",
    "ShortDescription": "Sofa",
    "Image": "c_6339b9f9-ee45-4d7d-8c69-f5dd4dfc4c0f.jpg",
    "Banner": "b_f3fcc438-eebe-4073-9da8-da04addfb9c0.jpg",
    "DisplayOrder": "15",
    "MetaTitle": "Sofas",
    "MetaKeywords": "Sofas",
    "MetaDescription": "Sofas",
    "IsActive": "1",
    "AddedBy": "1",
    "AddedDate": "2023-02-27 15:50:25.053",
    "UpdatedBy": "1",
    "UpdatedDate": "2025-12-03 12:22:59.277"
  },
  {
    "CategoryId": "17",
    "CategoryName": "Vanity Desks",
    "CustomURL": "vanity-desks",
    "ShortDescription": "Vanity Desks",
    "Image": "c_599b9114-4524-4785-b3e0-43a9a0e32155.jpg",
    "Banner": null,
    "DisplayOrder": "16",
    "MetaTitle": "Vanity Desks",
    "MetaKeywords": "Vanity Desks",
    "MetaDescription": "Vanity Desks",
    "IsActive": "1",
    "AddedBy": "1",
    "AddedDate": "2023-09-01 20:42:17.917",
    "UpdatedBy": "1",
    "UpdatedDate": "2025-12-03 14:47:12.617"
  },
  {
    "CategoryId": "9",
    "CategoryName": "Wardrobes",
    "CustomURL": "wardrobes",
    "ShortDescription": "Wardrobes",
    "Image": "c_fa77ffb9-c445-4726-8201-29a4cfbac507.jpg",
    "Banner": null,
    "DisplayOrder": "17",
    "MetaTitle": "Wardrobes",
    "MetaKeywords": "Wardrobes",
    "MetaDescription": "Wardrobes",
    "IsActive": "1",
    "AddedBy": "1",
    "AddedDate": "2023-09-01 19:16:35.817",
    "UpdatedBy": "1",
    "UpdatedDate": "2025-12-03 15:27:23.173"
  },
  {
    "CategoryId": "19",
    "CategoryName": "Working Desks",
    "CustomURL": "working-desks",
    "ShortDescription": "Working Desks",
    "Image": "c_fc44ed11-358d-4a31-a31d-94037627c62b.jpg",
    "Banner": "b_22b959b3-3d29-480f-9496-d2b20c1beb97.jpg",
    "DisplayOrder": "18",
    "MetaTitle": "Premium Working Desk",
    "MetaKeywords": "Bespoke working desk",
    "MetaDescription": "Wooden working Desk",
    "IsActive": "1",
    "AddedBy": "1",
    "AddedDate": "2023-09-01 20:54:14.027",
    "UpdatedBy": "1",
    "UpdatedDate": "2025-12-03 15:28:48.670"
  },
  {
    "CategoryId": "18",
    "CategoryName": "Mirrors",
    "CustomURL": "mirrors",
    "ShortDescription": "Mirrors",
    "Image": "c_75930e8c-d74e-46b6-962f-dc39a7f8af2a.jpg",
    "Banner": null,
    "DisplayOrder": "19",
    "MetaTitle": "Mirrors",
    "MetaKeywords": "Mirrors",
    "MetaDescription": "Mirrors",
    "IsActive": "1",
    "AddedBy": "1",
    "AddedDate": "2023-09-01 20:52:18.177",
    "UpdatedBy": "1",
    "UpdatedDate": "2025-12-03 15:28:58.333"
  }
];

async function seedCategories() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const catalogueService = app.get(CatalogueService);

  try {
    console.log('Starting category migration from old platform...');

    let successCount = 0;
    let errorCount = 0;

    for (const oldCategory of oldCategoriesData) {
      try {
        // Map old data to new Category entity format
        const categoryData = {
          name: oldCategory.CategoryName,
          slug: oldCategory.CustomURL,
          description: oldCategory.ShortDescription,
          image: oldCategory.Image,
          seo: {
            title: oldCategory.MetaTitle,
            description: oldCategory.MetaDescription,
            keywords: oldCategory.MetaKeywords,
          },
          isActive: oldCategory.IsActive === '1',
          createdAt: new Date(oldCategory.AddedDate),
          updatedAt: new Date(oldCategory.UpdatedDate),
        };

        // Create the category
        const createdCategory = await catalogueService.createCategory(categoryData);
        console.log(`✅ Created category: ${createdCategory.name} (${createdCategory._id})`);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to create category ${oldCategory.CategoryName}:`, error.message);
        errorCount++;
      }
    }

    console.log(`\nMigration completed:`);
    console.log(`✅ Successfully created: ${successCount} categories`);
    console.log(`❌ Failed to create: ${errorCount} categories`);

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await app.close();
  }
}

// Run the seed function
seedCategories().catch(console.error);