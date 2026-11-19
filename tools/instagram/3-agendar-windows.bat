@echo off
REM Cria tarefa no Agendador do Windows para postar Story todo dia às 9h
REM Execute este arquivo como ADMINISTRADOR uma única vez

set PASTA=C:\AMF\instagram-autopost
set NODE=node

schtasks /create ^
  /tn "AMF Estopas - Postar Story Instagram" ^
  /tr "%NODE% %PASTA%\2-postar-story-hoje.js" ^
  /sc DAILY ^
  /st 09:00 ^
  /sd 01/01/2026 ^
  /ru "%USERNAME%" ^
  /f

if %ERRORLEVEL% == 0 (
  echo.
  echo ✅ Tarefa criada com sucesso!
  echo    O script vai rodar todo dia às 09:00 automaticamente.
  echo.
) else (
  echo.
  echo ❌ Erro ao criar tarefa. Execute como Administrador.
  echo.
)
pause
