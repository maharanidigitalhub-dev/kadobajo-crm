// Hapus state ini:
const [showImport, setShowImport] = useState(false);
const [importFile, setImportFile] = useState<File | null>(null);
const [importing, setImporting] = useState(false);
const [importResult, setImportResult] = useState<any>(null);
const importRef = useRef<HTMLInputElement>(null);

// Hapus function ini:
async function handleImport() { ... }

// Hapus tombol ini di header:
<button onClick={() => { setShowImport(true); ... }}>
  📥 Import CSV
</button>

// Hapus seluruh modal Import CSV (dari {showImport && ( sampai )})
