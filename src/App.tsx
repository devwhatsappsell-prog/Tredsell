/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TrendSellProvider } from './context/TrendSellContext';
import { MainLayout } from './components/MainLayout';

export default function App() {
  return (
    <TrendSellProvider>
      <MainLayout />
    </TrendSellProvider>
  );
}
