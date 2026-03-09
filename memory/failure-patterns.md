# Failure Patterns

Build failures and errors encountered, their causes, and how they were (or could be) resolved.

---

## Build Tool Compilation Issues

### Issue: Missing build tools (Cycle 1)
**Error symptoms:**
```
bash: tools/mapjson/mapjson: No such file or directory
bash: tools/scaninc/scaninc: No such file or directory
make[1]: *** [gbagfx] Error 1
convert_png.c:5:10: fatal error: 'png.h' file not found
```

**Cause:**
- Build tools in `tools/` directory need to be compiled before ROM build
- Dependencies (libpng-dev) may be missing
- `make` attempts to build ROM before tools are ready

**Resolution:**
- Need to ensure build dependencies are installed (libpng-dev, etc.)
- Should run `make tools` or ensure tools build before ROM build
- On macOS, may need to install libpng via Homebrew: `brew install libpng`
- The Makefile should handle tool building automatically, but may fail if dependencies missing

**Prevention:**
- Check INSTALL.md for platform-specific setup steps
- Verify all build dependencies before attempting compilation
- Build tools separately first if main build fails
