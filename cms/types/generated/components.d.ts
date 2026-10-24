import type { Schema, Struct } from '@strapi/strapi';

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
      'shared.highlight': SharedHighlight;
      'shared.hour': SharedHour;
      'shared.spec': SharedSpec;
      'shared.stat': SharedStat;
    }
  }
}
