import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BrowsePage } from "./pages/BrowsePage";
import { RecipeDetailPage } from "./pages/RecipeDetailPage";
import { ApplyRecipePage } from "./pages/ApplyRecipePage";
import { SummaryPage } from "./pages/SummaryPage";
import { Layout } from "./components/Layout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<BrowsePage />} />
          <Route path="/recipe/:id" element={<RecipeDetailPage />} />
          <Route path="/recipe/:id/apply" element={<ApplyRecipePage />} />
          <Route path="/recipe/:id/summary" element={<SummaryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
