const ase = require('adobe-swatch-exchange');
const { createCanvas } = require('canvas');

/**
 * Servicio para exportar paletas a diferentes formatos compatibles con Figma y Canva.
 */
class ExportService {

    /**
     * Genera un formato JSON optimizado para Figma (compatible con plugins de variables/estilos).
     */
    static toFigma(palette) {
        return {
            name: palette.name,
            type: 'FIGMA_VARIABLES',
            version: '1.0',
            colors: palette.colors.map(c => ({
                name: c.name,
                value: c.hex,
                opacity: 1
            }))
        };
    }

    /**
     * Genera un bloque de variables CSS para desarrolladores.
     */
    static toCSS(palette) {
        let css = `:root {\n`;
        palette.colors.forEach((c, i) => {
            const slug = c.name.toLowerCase().replace(/\s+/g, '-');
            css += `  --aura-${slug}: ${c.hex};\n`;
        });
        css += `}\n`;
        return css;
    }

    /**
     * Genera un archivo .ASE (Adobe Swatch Exchange) para importar en Figma/Adobe.
     */
    static toASE(palette) {
        const colors = palette.colors.map(c => {
            // Convert Hex to RGB
            const r = parseInt(c.hex.slice(1, 3), 16) / 255;
            const g = parseInt(c.hex.slice(3, 5), 16) / 255;
            const b = parseInt(c.hex.slice(5, 7), 16) / 255;

            return {
                name: c.name,
                model: 'RGB',
                color: [r, g, b],
                type: 'global'
            };
        });

        const data = {
            version: '1.0',
            groups: [],
            colors: colors
        };

        return ase.encode(data);
    }

    /**
     * Genera una imagen (Buffer) optimizada para que Canva extraiga los colores.
     * Crea una tira horizontal con los 5 colores.
     */
    static async toCanvaImage(palette) {
        const width = 1000;
        const height = 200;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        const colorWidth = width / palette.colors.length;

        palette.colors.forEach((color, i) => {
            ctx.fillStyle = color.hex;
            ctx.fillRect(i * colorWidth, 0, colorWidth, height);
        });

        return canvas.toBuffer('image/png');
    }
}

module.exports = ExportService;
