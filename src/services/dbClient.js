import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    "https://xayykcfdqvaoefjemtty.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhheXlrY2ZkcXZhb2VmamVtdHR5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM4MjIwOCwiZXhwIjoyMDgwOTU4MjA4fQ.pxrioZSmZYunXZBiNyp903orf6tlabzlYhyu-gBblOo"
)

export default supabase;