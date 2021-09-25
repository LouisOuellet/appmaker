<div class="error-page">
  <h2 class="headline text-danger">500</h2>
  <div class="error-content">
    <h3><i class="fas fa-exclamation-triangle text-danger"></i> Oops! Something went wrong.</h3>
    <p>
      We will work on fixing that right away.
      Meanwhile, you may <a href="<?= (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http")."://".$_SERVER['HTTP_HOST'].'/' ?>">return to dashboard</a> or try using the search form.
    </p>
		<form method="get" class="search-form">
      <div class="input-group">
				<input type="text" style="display:none;" name="p" value="search">
				<input class="form-control" type="search" name="query" placeholder="Search" aria-label="Search" value="<?php if(isset($_GET['query'])){ echo $_GET['query']; } ?>">
        <div class="input-group-append">
          <button type="submit" class="btn btn-danger"><i class="fas fa-search"></i>
          </button>
        </div>
      </div>
    </form>
  </div>
</div>
