/**
 * Glassmorphism Apple Style Effect
 * 
 * Principais funcionalidades:
 * - Renderização de fundo animado com gradientes e formas geométricas
 * - Efeito de refração de vidro em tempo real
 * - Interação com mouse para movimento do botão
 * - Controles dinâmicos para ajustar parâmetros do efeito
 */

class GlassmorphismEffect {
    constructor() {
        this.init();
    }

    init() {
        this.initializeProperties();
        this.setupCanvases();
        this.createBackgroundPattern();
        this.setupEventListeners();
        this.setInitialPosition();
        this.animate();
    }

    initializeProperties() {
        // Propriedades do botão e efeitos
        this.buttonSize = 220;
        this.refractionStrength = 1.5;
        this.glassOpacity = 0.3;
        this.edgeBlur = 8;

        // Propriedades de movimento
        this.buttonX = 0;
        this.buttonY = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.isMouseDown = false;

        // Propriedades de animação
        this.animationTime = 0;
        this.backgroundObjects = [];

        // Configurações do botão
        this.buttonConfig = {
            radius: 25,
            aspectRatio: 1.5,
            text: 'Pesquisar'
        };
    }

    setupCanvases() {
        this.backgroundCanvas = document.getElementById('background-canvas');
        this.glassCanvas = document.getElementById('glass-canvas');

        this.backgroundCanvas.width = window.innerWidth;
        this.backgroundCanvas.height = window.innerHeight;
        this.glassCanvas.width = window.innerWidth;
        this.glassCanvas.height = window.innerHeight;

        this.backgroundCtx = this.backgroundCanvas.getContext('2d');
        this.glassCtx = this.glassCanvas.getContext('2d');

        // Adicionar polyfill para roundRect se necessário
        this.addRoundRectPolyfill();
    }

    createBackgroundPattern() {
        this.backgroundObjects = [];

        // Gradiente base
        const gradient = this.backgroundCtx.createLinearGradient(0, 0, window.innerWidth, window.innerHeight);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(0.3, '#764ba2');
        gradient.addColorStop(0.6, '#f093fb');
        gradient.addColorStop(1, '#f5576c');

        this.backgroundCtx.fillStyle = gradient;
        this.backgroundCtx.fillRect(0, 0, window.innerWidth, window.innerHeight);

        // Configurar objetos de fundo
        this.createBackgroundObjects();
        this.addBackgroundText();
        this.addBackgroundGrid();
    }

    createBackgroundObjects() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#a8e6cf'];

        for (let i = 0; i < 25; i++) {
            const obj = {
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                size: Math.random() * 100 + 50,
                color: colors[Math.floor(Math.random() * colors.length)],
                type: Math.floor(Math.random() * 3), // 0: círculo, 1: retângulo, 2: triângulo
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                moveSpeedX: (Math.random() - 0.5) * 0.5,
                moveSpeedY: (Math.random() - 0.5) * 0.5
            };
            this.backgroundObjects.push(obj);
        }
    }

    addBackgroundText() {
        this.backgroundCtx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        this.backgroundCtx.font = 'bold 120px Arial';
        this.backgroundCtx.fillText('APPLE', 100, 200);
        this.backgroundCtx.fillText('GLASS', 300, 400);
        this.backgroundCtx.fillText('DESIGN', 50, 600);
    }

    addBackgroundGrid() {
        this.backgroundCtx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.backgroundCtx.lineWidth = 1;

        // Linhas verticais
        for (let x = 0; x < window.innerWidth; x += 50) {
            this.backgroundCtx.beginPath();
            this.backgroundCtx.moveTo(x, 0);
            this.backgroundCtx.lineTo(x, window.innerHeight);
            this.backgroundCtx.stroke();
        }

        // Linhas horizontais
        for (let y = 0; y < window.innerHeight; y += 50) {
            this.backgroundCtx.beginPath();
            this.backgroundCtx.moveTo(0, y);
            this.backgroundCtx.lineTo(window.innerWidth, y);
            this.backgroundCtx.stroke();
        }
    }

    updateBackground() {
        // Limpar canvas
        this.backgroundCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        // Gradiente base animado
        this.drawAnimatedGradient();

        // Atualizar e desenhar objetos
        this.updateBackgroundObjects();
    }

    drawAnimatedGradient() {
        const gradient = this.backgroundCtx.createLinearGradient(
            Math.sin(this.animationTime * 0.001) * 200,
            Math.cos(this.animationTime * 0.001) * 200,
            window.innerWidth + Math.sin(this.animationTime * 0.0015) * 200,
            window.innerHeight + Math.cos(this.animationTime * 0.0015) * 200
        );
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(0.25, '#764ba2');
        gradient.addColorStop(0.5, '#f093fb');
        gradient.addColorStop(0.75, '#f5576c');
        gradient.addColorStop(1, '#4ecdc4');

        this.backgroundCtx.fillStyle = gradient;
        this.backgroundCtx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    }

    updateBackgroundObjects() {
        this.backgroundObjects.forEach(obj => {
            // Atualizar posição e rotação
            obj.x += obj.moveSpeedX;
            obj.y += obj.moveSpeedY;
            obj.rotation += obj.rotationSpeed;

            // Wrap around edges
            this.wrapObjectAroundEdges(obj);

            // Desenhar objeto
            this.drawBackgroundObject(obj);
        });
    }

    wrapObjectAroundEdges(obj) {
        if (obj.x < -obj.size) obj.x = window.innerWidth + obj.size;
        if (obj.x > window.innerWidth + obj.size) obj.x = -obj.size;
        if (obj.y < -obj.size) obj.y = window.innerHeight + obj.size;
        if (obj.y > window.innerHeight + obj.size) obj.y = -obj.size;
    }

    drawBackgroundObject(obj) {
        this.backgroundCtx.save();
        this.backgroundCtx.translate(obj.x, obj.y);
        this.backgroundCtx.rotate(obj.rotation);
        this.backgroundCtx.fillStyle = obj.color;
        this.backgroundCtx.globalAlpha = 0.7;

        switch (obj.type) {
            case 0: // Círculo
                this.backgroundCtx.beginPath();
                this.backgroundCtx.arc(0, 0, obj.size / 2, 0, Math.PI * 2);
                this.backgroundCtx.fill();
                break;
            case 1: // Retângulo
                this.backgroundCtx.fillRect(-obj.size / 2, -obj.size / 2, obj.size, obj.size * 0.6);
                break;
            case 2: // Triângulo
                this.backgroundCtx.beginPath();
                this.backgroundCtx.moveTo(0, -obj.size / 2);
                this.backgroundCtx.lineTo(-obj.size / 2, obj.size / 2);
                this.backgroundCtx.lineTo(obj.size / 2, obj.size / 2);
                this.backgroundCtx.closePath();
                this.backgroundCtx.fill();
                break;
        }

        this.backgroundCtx.restore();
    }

    drawGlassButton() {
        this.glassCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        const buttonWidth = this.buttonSize;
        const buttonHeight = this.buttonSize / this.buttonConfig.aspectRatio;
        const radius = this.buttonConfig.radius;

        // Capturar e aplicar efeito de refração
        const refractedImageData = this.createRefractionEffect(buttonWidth, buttonHeight);

        // Desenhar botão com efeito de vidro
        this.renderGlassButton(buttonWidth, buttonHeight, radius, refractedImageData);
    }

    createRefractionEffect(buttonWidth, buttonHeight) {
        const backgroundImageData = this.backgroundCtx.getImageData(
            this.buttonX - buttonWidth / 2,
            this.buttonY - buttonHeight / 2,
            buttonWidth,
            buttonHeight
        );

        const refractedImageData = this.backgroundCtx.createImageData(backgroundImageData);
        const data = backgroundImageData.data;
        const refractedData = refractedImageData.data;

        const centerX = buttonWidth / 2;
        const centerY = buttonHeight / 2;

        for (let y = 0; y < backgroundImageData.height; y++) {
            for (let x = 0; x < backgroundImageData.width; x++) {
                const index = (y * backgroundImageData.width + x) * 4;

                // Calcular distorção de lente
                const dx = x - centerX;
                const dy = y - centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const normalizedDistance = distance / (Math.min(buttonWidth, buttonHeight) / 2);

                const distortion = Math.sin(normalizedDistance * Math.PI * 0.5) * this.refractionStrength * 0.1;
                const sourceX = Math.round(x - dx * distortion);
                const sourceY = Math.round(y - dy * distortion);

                if (sourceX >= 0 && sourceX < backgroundImageData.width &&
                    sourceY >= 0 && sourceY < backgroundImageData.height) {
                    const sourceIndex = (sourceY * backgroundImageData.width + sourceX) * 4;

                    refractedData[index] = data[sourceIndex];
                    refractedData[index + 1] = data[sourceIndex + 1];
                    refractedData[index + 2] = data[sourceIndex + 2];
                    refractedData[index + 3] = data[sourceIndex + 3];
                } else {
                    refractedData[index] = data[index];
                    refractedData[index + 1] = data[index + 1];
                    refractedData[index + 2] = data[index + 2];
                    refractedData[index + 3] = data[index + 3];
                }
            }
        }

        return refractedImageData;
    }

    renderGlassButton(buttonWidth, buttonHeight, radius, refractedImageData) {
        this.glassCtx.save();
        this.glassCtx.translate(this.buttonX, this.buttonY);

        // Aplicar máscara do botão
        this.glassCtx.beginPath();
        this.glassCtx.roundRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, radius);
        this.glassCtx.clip();

        // Desenhar imagem de fundo original
        this.glassCtx.drawImage(
            this.backgroundCanvas,
            this.buttonX - buttonWidth / 2, this.buttonY - buttonHeight / 2, buttonWidth, buttonHeight,
            -buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight
        );

        // Aplicar efeito de refração
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = buttonWidth;
        tempCanvas.height = buttonHeight;
        tempCtx.putImageData(refractedImageData, 0, 0);

        this.glassCtx.globalAlpha = 0.8;
        this.glassCtx.drawImage(tempCanvas, -buttonWidth / 2, -buttonHeight / 2);
        this.glassCtx.globalAlpha = 1;

        this.glassCtx.restore();

        // Desenhar moldura e overlay
        this.drawButtonFrame(buttonWidth, buttonHeight, radius);
    }

    drawButtonFrame(buttonWidth, buttonHeight, radius) {
        this.glassCtx.save();
        this.glassCtx.translate(this.buttonX, this.buttonY);

        // Sombra
        this.glassCtx.shadowColor = 'rgba(0, 0, 0, 0.25)';
        this.glassCtx.shadowBlur = 15;
        this.glassCtx.shadowOffsetY = 8;

        // Forma do botão
        this.glassCtx.beginPath();
        this.glassCtx.roundRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, radius);

        // Overlay com transparência
        this.glassCtx.fillStyle = `rgba(255, 255, 255, ${this.glassOpacity * 0.3})`;
        this.glassCtx.fill();

        // Borda sutil
        this.glassCtx.strokeStyle = `rgba(255, 255, 255, ${this.glassOpacity})`;
        this.glassCtx.lineWidth = 0.5;
        this.glassCtx.stroke();

        // Texto centralizado
        this.drawButtonText();

        this.glassCtx.restore();
    }

    drawButtonText() {
        this.glassCtx.shadowColor = 'transparent';
        this.glassCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.glassCtx.font = 'bold 16px -apple-system, BlinkMacSystemFont, sans-serif';
        this.glassCtx.textAlign = 'center';
        this.glassCtx.textBaseline = 'middle';
        this.glassCtx.fillText(this.buttonConfig.text, 0, 0);
    }

    setupEventListeners() {
        this.setupMouseEvents();
        this.setupControlEvents();
        this.setupResizeEvent();
    }

    setupMouseEvents() {
        this.glassCanvas.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;

            if (!this.isMouseDown) {
                this.targetX = this.mouseX;
                this.targetY = this.mouseY;
            }
        });

        this.glassCanvas.addEventListener('mousedown', (e) => {
            this.isMouseDown = true;
            this.targetX = e.clientX;
            this.targetY = e.clientY;
        });

        this.glassCanvas.addEventListener('mouseup', () => {
            this.isMouseDown = false;
        });
    }

    setupControlEvents() {
        // Controle de intensidade da refração
        document.getElementById('refractionStrength').addEventListener('input', (e) => {
            this.refractionStrength = parseFloat(e.target.value);
            document.getElementById('refractionValue').textContent = this.refractionStrength;
        });

        // Controle de transparência
        document.getElementById('glassOpacity').addEventListener('input', (e) => {
            this.glassOpacity = parseFloat(e.target.value);
            document.getElementById('opacityValue').textContent = this.glassOpacity;
        });

        // Controle de desfoque de borda
        document.getElementById('edgeBlur').addEventListener('input', (e) => {
            this.edgeBlur = parseFloat(e.target.value);
            document.getElementById('blurValue').textContent = this.edgeBlur;
        });

        // Controle de tamanho do botão
        document.getElementById('buttonSize').addEventListener('input', (e) => {
            this.buttonSize = parseFloat(e.target.value);
            document.getElementById('sizeValue').textContent = this.buttonSize;
        });
    }

    setupResizeEvent() {
        window.addEventListener('resize', () => {
            this.setupCanvases();
            this.createBackgroundPattern();
        });
    }

    setInitialPosition() {
        this.buttonX = window.innerWidth / 2;
        this.buttonY = window.innerHeight / 2;
        this.targetX = this.buttonX;
        this.targetY = this.buttonY;
    }

    updateButtonPosition() {
        // Movimento suave do botão
        this.buttonX += (this.targetX - this.buttonX) * 0.1;
        this.buttonY += (this.targetY - this.buttonY) * 0.1;

        // Movimento automático sutil quando não há interação
        if (!this.isMouseDown &&
            Math.abs(this.mouseX - this.targetX) < 5 &&
            Math.abs(this.mouseY - this.targetY) < 5) {
            this.targetX += Math.sin(this.animationTime * 0.001) * 0.5;
            this.targetY += Math.cos(this.animationTime * 0.0007) * 0.3;
        }
    }

    animate() {
        this.animationTime = Date.now();

        this.updateButtonPosition();
        this.updateBackground();
        this.drawGlassButton();

        requestAnimationFrame(() => this.animate());
    }

    addRoundRectPolyfill() {
        if (!CanvasRenderingContext2D.prototype.roundRect) {
            CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
                this.beginPath();
                this.moveTo(x + radius, y);
                this.lineTo(x + width - radius, y);
                this.quadraticCurveTo(x + width, y, x + width, y + radius);
                this.lineTo(x + width, y + height - radius);
                this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
                this.lineTo(x + radius, y + height);
                this.quadraticCurveTo(x, y + height, x, y + height - radius);
                this.lineTo(x, y + radius);
                this.quadraticCurveTo(x, y, x + radius, y);
                this.closePath();
            };
        }
    }
}

// Inicializar quando a página carregar
window.addEventListener('load', () => {
    new GlassmorphismEffect();
});
