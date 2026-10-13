// Public S3 URLs of real Tritorc Media Library photos, used when Strapi is
// unreachable or unconfigured (e.g. local dev without credentials). Live Strapi
// results always take priority — see getImageUrls() in lib/strapi.ts.
import type { ImageKey } from "./images";

export const IMAGE_FALLBACK_URLS: Partial<Record<ImageKey, string>> = {
  homeHero: "https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/product_category_torque_htw_01_ee8aa345e00b82d9_2ebe5dcd22.webp",
  certIso: "https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/ppc_images_cert_iso_webp_f905a61ffa4b6ab1_de7f542bc6.webp",
  certCe: "https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/ppc_images_cert_ce_seeklogo_png_d2009155853ba0c5_1f2dc8bf57.png",
  companyIntro: "https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/about_page_introduction_9e4760a564451181_dee2cc9990.webp",
  catWindTurbine: "https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/ppc_images_collage_tsl_wind_turbine_white_png_6d12220863838799_130b0e60f6.png",
  productTorqueHero: "https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/product_category_torque_htw_01_ee8aa345e00b82d9_2ebe5dcd22.webp",
  impactBg: "https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/product_category_torque_htw_02_1c40d28ce0a36924_cf5c1eeac0.webp",
  productTensionerHero: "https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/product_category_bolt_tensioners_hero_faab38eb2a3d52d1_0977bce128.webp",
  svcHotTapping: "https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/ppc_images_hottapping_hot_tapping_1_webp_746fb127b4f429dc_6487d32429.webp",
  svcOnSiteMachining: "https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/product_category_on_site_machining_tools_and_accessories_hero_7461d76acbc4ed25_c6ad75857c.webp",
  svcPipeCutting: "https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/product_category_tube_and_pipe_beveling_machine_hero_963e385f4effc986_a2f50aa294.webp",
  caseReliance: "https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/ppc_images_qatar_gas_webp_959701032810fe03_3d327fcf63.webp",
  caseAdani: "https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/ppc_images_collage_cbtl_for_wind_application_201_jpg_7423d01fb860de8a_84910dfdeb.jpg",
  caseSamsung: "https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/ppc_images_tubing_min_jpg_05ba72638ffb7774_493a39c9b1.jpg",
  caseKarabatan: "https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/ppc_images_karbatan_jpg_531c1b769b2d38b2_2205b9a41f.jpg",
  testimonial1: "https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/ppc_images_testi_1_jpg_3d331bd251163176_b3c4ff798b.jpg",
  testimonial2: "https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/ppc_images_testimonail_jpg_ce659d725ef7f43d_0c5518e15c.jpg",
  catImpactSockets: "https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/product_category_impact_socket_family_0283e5233e82c94e_e60f63bffc.png",
  catPipeColdCutting: "https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/products_landing_pipe_cold_cutting_and_beveling_machines_0d5300eec27c6be4_2a77e371ea.webp",
  catFlangeFacing: "https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/products_landing_flange_facing_machines_282965af4982a1fd_f9ffeadb93.webp",
  catTubeBeveling: "https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/product_category_tube_and_pipe_beveling_machine_hero_963e385f4effc986_a2f50aa294.webp",
  catTubeExpanders: "https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/product_category_tube_expanders_hero_51cb920bb24b6f66_6209ca6787.webp",
  catTubeInstallation: "https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/product_category_tube_installation_tools_hero_9da06b023c0f21ca_a8470732dd.webp",
  catTubeRemoval: "https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/products_landing_tube_removal_tools_cb610321368d343e_baaa07f4f6.webp",
  catTubeCleaning: "https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/product_category_tube_cleaners_hero_45c75b4a6c94101c_ebbb5e9ecb.webp",
  catSingleActingCylinders: "https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/product_category_single_acting_cylinders_hero_bc3c795ba1d5a4c5_05f92085fc.webp",
  catDoubleActingCylinders: "https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/product_category_double_acting_cylinders_hero_27c7e535277f4ad7_32a3f9cca1.webp",
  catCylinderPowerpacks: "https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/product_category_cylinder_powerpacks_pumps_hero_f4cc8db76ebc47ff_20b480ece1.webp",
  svcDryRental: "https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/ppc_images_collage_dry_rental_gen_new_01_jpg_23d7a99e526fef90_0b30b3c3c1.jpg",
  svcEmergencyRepairClamp: "https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/ppc_images_hottapping_fittings_optimized_webp_8cb84bebd77a162d_aa11d474e9.webp",
  svcOnlineLeakSealing: "https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/ppc_images_hottapping_gcc_home_webp_e71633422678257a_8f223be08c.webp",
  svcCalibration: "https://tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com/uploads/about_page_services_76263159dc124c72_e7040bdf1f.jpg",
};
