module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "standard"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "@typescript-eslint"
    ],
    "rules": { // 0: off, 1:warn, 2:error
        "semi": "off",
        "no-multiple-empty-lines": "off",
        "no-use-before-define": "off", // overrided @typescript-eslint/no-use-before-define
        "@typescript-eslint/no-use-before-define": "warn",
        "react/prop-types": "off",// is defined with typescript types
        "indent": "off",
        "quotes": "off",
        "spaced-comment": "off",
        "curly": "off",
        "object-curly-spacing": "off",
        "padded-blocks": "off",
        "operator-linebreak": "off",
        "camelcase": "off",
        "multiline-ternary": "off",
        "no-useless-return": "warn",
        "no-trailing-spaces": "off",
        "brace-style": "off",
        "react/display-name": "off",
        "space-infix-ops": "off",
        "keyword-spacing": "off",
        "space-before-blocks": "off",
        "key-spacing": "off",
        "quote-props": "warn",
        "import/no-duplicates": "warn",
        "no-unused-vars": "off", //overrided @typescript-eslint/no-unused-vars
        "@typescript-eslint/no-unused-vars": "warn",
        "no-extra-boolean-cast": "warn",
        "space-before-function-paren": "off",
        "func-call-spacing": "off",
        "@typescript-eslint/no-use-before-define": "off",
        "comma-dangle": "off",
        "dot-notation": "off",
        "arrow-spacing": "off",
        "eol-last": "off",
        "no-multi-spaces": "off",
        "no-undef": "off", //overrided @typescript-eslint
        "react/no-unescaped-entities": "off"
    },
    "settings": {
        "react": {
            "version": "^16.14.0",
        }
    }
};
