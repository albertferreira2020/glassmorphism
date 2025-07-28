#!/bin/bash

# Script para configurar a imagem de demonstração
# Execute este script após salvar a imagem como 'glassmorphism-demo.png' na pasta assets/

echo "🎨 Configurando imagem de demonstração do Glassmorphism..."

# Verificar se o diretório assets existe
if [ ! -d "assets" ]; then
    echo "📁 Criando diretório assets..."
    mkdir assets
fi

# Verificar se a imagem existe
if [ -f "assets/glassmorphism-demo.png" ]; then
    echo "✅ Imagem encontrada: assets/glassmorphism-demo.png"
    
    # Mostrar informações da imagem
    if command -v file &> /dev/null; then
        echo "📊 Informações da imagem:"
        file assets/glassmorphism-demo.png
    fi
    
    echo ""
    echo "🎯 A imagem está configurada corretamente!"
    echo "🔗 Ela aparecerá no README.md na seção '🎯 Demonstração'"
    echo ""
    echo "📝 Para visualizar o README com a imagem:"
    echo "   - Abra o README.md no GitHub"
    echo "   - Ou use um visualizador de Markdown local"
    
else
    echo "❌ Imagem não encontrada!"
    echo ""
    echo "📋 Instruções:"
    echo "1. Salve a screenshot como 'glassmorphism-demo.png'"
    echo "2. Coloque o arquivo na pasta 'assets/'"
    echo "3. Execute este script novamente"
    echo ""
    echo "📂 Caminho esperado: ./assets/glassmorphism-demo.png"
fi

echo ""
echo "🚀 Projeto pronto para uso!"
