const { defineConfig, configDefaults } = require("vitest/config")

export default defineConfig({
    test: {
        exclude: [...configDefaults.exclude, '.homeybuild', '.homeycompose']
    }
});