{
  description = "Internet of sh0rkz";

  inputs = {
    nixpkgs.url = "nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachSystem [ "x86_64-linux" "aarch64-linux" ] (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            deno
            nodejs
            nodePackages.typescript
            nodePackages.typescript-language-server
            jo
          ];
        };

        DATABASE_PATH = "./test.db";
      }
    );
}
