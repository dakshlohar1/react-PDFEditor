import "./App.css";
import { PDFEditorProvider, PDFEditor } from "react-pdfeditor";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

function App() {
  return (
    <div className="App">
      <PDFEditorProvider value={{} as any}>
        <PDFEditor />
      </PDFEditorProvider>
    </div>
  );
}

export default App;
