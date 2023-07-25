import React, { FC } from 'react';
import { CatalogContent } from '../components/catalog-content/catalog-content';
import { Header } from '../components/header/header';

export const CatalogPage: FC = () => {
  return (
    <>
      <Header/>
      <CatalogContent />
    </>
  )
};
