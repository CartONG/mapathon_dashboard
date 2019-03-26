'use strict';

import { a, img } from './basic';

export function headerImageLink(model) {
  return a({
    href: model.linkHref,
    target: '_blank',
    children: [
      img({
        id: model.imgId,
        src: model.imgSrc,
        alt: model.imgAlt
      })
    ]
  });
}