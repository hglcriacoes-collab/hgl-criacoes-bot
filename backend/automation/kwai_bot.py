from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError
import asyncio
import logging
from pathlib import Path
import json

logger = logging.getLogger(__name__)

class KwaiBot:
    def __init__(self, user_id: str):
        self.user_id = user_id
        self.cookies_path = Path(f"/app/backend/sessions/kwai_{user_id}.json")
        self.cookies_path.parent.mkdir(exist_ok=True)
        
    async def login(self, username: str, password: str) -> dict:
        """
        Faz login no Kwai e salva a sessão
        """
        try:
            async with async_playwright() as p:
                browser = await p.chromium.launch(
                    headless=True,
                    args=[
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-dev-shm-usage'
                    ]
                )
                context = await browser.new_context(
                    viewport={'width': 1920, 'height': 1080},
                    user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                )
                page = await context.new_page()
                
                # Navegar para Kwai
                logger.info("Navegando para Kwai...")
                await page.goto('https://www.kwai.com/', wait_until='networkidle')
                await asyncio.sleep(2)
                
                # Clicar em login
                try:
                    await page.click('button:has-text("Entrar")', timeout=5000)
                except:
                    await page.click('a:has-text("Login")', timeout=5000)
                
                await asyncio.sleep(1)
                
                # Preencher credenciais
                await page.fill('input[type="text"], input[type="email"], input[name="username"]', username)
                await page.fill('input[type="password"]', password)
                
                # Clicar em entrar
                await page.click('button[type="submit"]')
                await asyncio.sleep(3)
                
                # Verificar se logou
                try:
                    await page.wait_for_selector('.user-profile, .avatar', timeout=5000)
                    logger.info("Login bem-sucedido!")
                    
                    # Salvar cookies
                    cookies = await context.cookies()
                    with open(self.cookies_path, 'w') as f:
                        json.dump(cookies, f)
                    
                    await browser.close()
                    return {
                        "success": True,
                        "message": "Login realizado com sucesso!"
                    }
                except PlaywrightTimeoutError:
                    await browser.close()
                    return {
                        "success": False,
                        "error": "Login falhou. Verifique usuário e senha."
                    }
                    
        except Exception as e:
            logger.error(f"Erro no login: {str(e)}")
            return {
                "success": False,
                "error": f"Erro: {str(e)}"
            }
    
    async def post_video(self, video_path: str, title: str, description: str = "") -> dict:
        """
        Posta um vídeo no Kwai usando sessão salva
        """
        try:
            # Verificar se tem sessão salva
            if not self.cookies_path.exists():
                return {
                    "success": False,
                    "error": "Sessão não encontrada. Faça login primeiro."
                }
            
            # Carregar cookies
            with open(self.cookies_path, 'r') as f:
                cookies = json.load(f)
            
            async with async_playwright() as p:
                browser = await p.chromium.launch(
                    headless=True,
                    args=[
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-dev-shm-usage'
                    ]
                )
                context = await browser.new_context(
                    viewport={'width': 1920, 'height': 1080},
                    user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                )
                await context.add_cookies(cookies)
                page = await context.new_page()
                
                # Navegar para página de upload
                logger.info("Navegando para página de upload...")
                await page.goto('https://www.kwai.com/upload', wait_until='networkidle')
                await asyncio.sleep(2)
                
                # Upload do vídeo
                logger.info("Fazendo upload do vídeo...")
                file_input = await page.query_selector('input[type="file"]')
                if not file_input:
                    await browser.close()
                    return {
                        "success": False,
                        "error": "Não encontrou campo de upload"
                    }
                
                await file_input.set_input_files(video_path)
                await asyncio.sleep(5)  # Aguardar upload
                
                # Preencher título
                logger.info("Preenchendo informações...")
                title_input = await page.query_selector('input[name="title"], textarea[placeholder*="título"], textarea[placeholder*="Título"]')
                if title_input:
                    await title_input.fill(title)
                
                # Preencher descrição (se houver)
                if description:
                    desc_input = await page.query_selector('textarea[name="description"], textarea[placeholder*="descrição"]')
                    if desc_input:
                        await desc_input.fill(description)
                
                await asyncio.sleep(2)
                
                # Publicar
                logger.info("Publicando...")
                publish_button = await page.query_selector('button:has-text("Publicar"), button:has-text("Postar"), button.publish-button')
                if publish_button:
                    await publish_button.click()
                    await asyncio.sleep(5)
                    
                    # Verificar se publicou
                    try:
                        await page.wait_for_selector('.success, .published', timeout=10000)
                        logger.info("Vídeo publicado com sucesso!")
                        await browser.close()
                        return {
                            "success": True,
                            "message": "Vídeo publicado no Kwai!"
                        }
                    except PlaywrightTimeoutError:
                        await browser.close()
                        return {
                            "success": True,
                            "message": "Vídeo enviado (aguardando confirmação)"
                        }
                else:
                    await browser.close()
                    return {
                        "success": False,
                        "error": "Botão de publicar não encontrado"
                    }
                    
        except Exception as e:
            logger.error(f"Erro ao postar: {str(e)}")
            return {
                "success": False,
                "error": f"Erro: {str(e)}"
            }