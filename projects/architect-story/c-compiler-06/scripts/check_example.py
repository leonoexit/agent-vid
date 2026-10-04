from pathlib import Path
import subprocess,tempfile,hashlib,json
p=Path(__file__).resolve().parents[1];source=p/'scripts/hello.c'
with tempfile.TemporaryDirectory() as tmp:
 executable=Path(tmp)/'hello'
 result=subprocess.run(['clang',str(source),'-o',str(executable)],capture_output=True,text=True,check=True)
 run=subprocess.run([str(executable)],capture_output=True,text=True,check=True)
 assert run.stdout=='Chao ban!\n' and run.stderr==''
 report={'source_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'compiler':subprocess.check_output(['clang','--version'],text=True).splitlines()[0],'build_args':['clang','hello.c','-o','hello'],'build_stderr':result.stderr,'stdout':run.stdout,'exit_code':run.returncode,'source_preserved':source.exists()}
 (p/'example-results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(report)
