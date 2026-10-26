import type { Schema, Struct } from '@strapi/strapi';

export interface CompanyCertificationBadge extends Struct.ComponentSchema {
  collectionName: 'components_company_certification-badges';
  info: {
    displayName: 'Certification badge';
  };
  attributes: {
    alt: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    imageUrl: Schema.Attribute.String;
    note: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface CompanySlide extends Struct.ComponentSchema {
  collectionName: 'components_company_slides';
  info: {
    displayName: 'Overview slide';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
    imageUrl: Schema.Attribute.String;
    position: Schema.Attribute.String;
  };
}

export interface HomeCaseTile extends Struct.ComponentSchema {
  collectionName: 'components_home_case-tiles';
  info: {
    displayName: 'Case tile';
  };
  attributes: {
    alt: Schema.Attribute.String;
    href: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    imagePosition: Schema.Attribute.String;
    imageUrl: Schema.Attribute.String;
    note: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomeHeroSlide extends Struct.ComponentSchema {
  collectionName: 'components_home_hero-slides';
  info: {
    displayName: 'Hero slide';
  };
  attributes: {
    eyebrow: Schema.Attribute.String;
    href: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    imagePosition: Schema.Attribute.String;
    imageUrl: Schema.Attribute.String;
    lines: Schema.Attribute.JSON;
    side: Schema.Attribute.Enumeration<['left', 'right']> &
      Schema.Attribute.DefaultTo<'right'>;
  };
}

export interface HomeQuote extends Struct.ComponentSchema {
  collectionName: 'components_home_quotes';
  info: {
    displayName: 'Quote';
  };
  attributes: {
    author: Schema.Attribute.String & Schema.Attribute.Required;
    quote: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface SharedHighlight extends Struct.ComponentSchema {
  collectionName: 'components_shared_highlights';
  info: {
    displayName: 'Highlight';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedHour extends Struct.ComponentSchema {
  collectionName: 'components_shared_hours';
  info: {
    displayName: 'Hour';
  };
  attributes: {
    day: Schema.Attribute.String & Schema.Attribute.Required;
    hours: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_links';
  info: {
    displayName: 'Link';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSpec extends Struct.ComponentSchema {
  collectionName: 'components_shared_specs';
  info: {
    displayName: 'Spec';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedStat extends Struct.ComponentSchema {
  collectionName: 'components_shared_stats';
  info: {
    displayName: 'Stat';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'company.certification-badge': CompanyCertificationBadge;
      'company.slide': CompanySlide;
      'home.case-tile': HomeCaseTile;
      'home.hero-slide': HomeHeroSlide;
      'home.quote': HomeQuote;
      'shared.highlight': SharedHighlight;
      'shared.hour': SharedHour;
      'shared.link': SharedLink;
      'shared.spec': SharedSpec;
      'shared.stat': SharedStat;
    }
  }
}
