async function buyNow(sku, amount) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    alert('Please login first!');
    document.getElementById('login-btn')?.click();
    return;
  }

  const { error } = await supabase
    .from('purchases')
    .insert({
      user_id: session.user.id,
      product_sku: sku,
      amount: amount
    });

  if (error) {
    alert('Purchase failed: ' + error.message);
  } else {
    alert('Thank you! Purchase recorded. Check your profile.');
    window.location.href = '/samplepagetwo/profile.html';
  }
}
